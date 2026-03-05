import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "../../../../lib/auth";
import { connectToDatabase } from "../../../../lib/mongodb";
import { UserModel } from "../../../../models/User";

export async function GET(request: NextRequest) {
  try {
    const payload = getAuthUser(request);
    if (!payload) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    await connectToDatabase();
    const user = await UserModel.findById(payload.userId).lean();
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json(
      { user: { userId: String(user._id), username: user.username } },
      { status: 200 },
    );
  } catch (error) {
    console.error("[GET /api/auth/me]", error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
