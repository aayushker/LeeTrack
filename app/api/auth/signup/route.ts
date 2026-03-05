import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "../../../../lib/mongodb";
import { UserModel } from "../../../../models/User";
import { signToken } from "../../../../lib/jwt";

function suggestAlternatives(username: string): string[] {
  return [`${username}1`, `${username}2`, `${username}_lc`, `${username}123`];
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 },
      );
    }

    const lower = username.trim().toLowerCase();

    if (lower.length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters." },
        { status: 400 },
      );
    }
    if (password.length < 4) {
      return NextResponse.json(
        { error: "Password must be at least 4 characters." },
        { status: 400 },
      );
    }

    // Check for existing username
    const existing = await UserModel.findOne({ username: lower });
    if (existing) {
      const suggestions = suggestAlternatives(lower);
      return NextResponse.json(
        {
          error: "Username already taken.",
          suggestions,
          redirectLogin: true,
        },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await UserModel.create({ username: lower, passwordHash });

    const token = signToken({
      userId: String(user._id),
      username: user.username,
    });

    const response = NextResponse.json(
      { message: "Account created.", username: user.username },
      { status: 201 },
    );
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("[POST /api/auth/signup]", error);
    return NextResponse.json({ error: "Signup failed." }, { status: 500 });
  }
}
