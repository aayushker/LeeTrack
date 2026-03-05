import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "../../../../lib/mongodb";
import { UserModel } from "../../../../models/User";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const { username, currentPassword, newPassword } = await request.json();

    if (!username || !currentPassword || !newPassword) {
      return NextResponse.json(
        {
          error: "username, currentPassword, and newPassword are all required.",
        },
        { status: 400 },
      );
    }

    if (newPassword.length < 4) {
      return NextResponse.json(
        { error: "New password must be at least 4 characters." },
        { status: 400 },
      );
    }

    const user = await UserModel.findOne({
      username: username.trim().toLowerCase(),
    });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 },
      );
    }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 401 },
      );
    }

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    await user.save();

    return NextResponse.json(
      { message: "Password updated successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.error("[POST /api/auth/reset-password]", error);
    return NextResponse.json(
      { error: "Password reset failed." },
      { status: 500 },
    );
  }
}
