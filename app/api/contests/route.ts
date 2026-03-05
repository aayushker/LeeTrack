import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import { ContestModel } from "../../../models/Contest";
import { runMigration } from "../../../lib/migrate";

export async function GET() {
  try {
    await runMigration();
    await connectToDatabase();

    const contests = await ContestModel.find({}).sort({ date: -1 }).lean();

    const formatted = contests.map((c) => ({
      id: c.contestId,
      title: c.title,
      type: c.contestType === "biweekly" ? "Biweekly" : "Weekly",
      date: c.date,
      contestNumber: c.contestNumber,
      url: c.url,
    }));

    return NextResponse.json({ contests: formatted }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/contests]", error);
    return NextResponse.json(
      { error: "Failed to fetch contests" },
      { status: 500 },
    );
  }
}
