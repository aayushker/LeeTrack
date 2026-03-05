import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongodb";
import { UserContestStatModel } from "../../../../models/UserContestStat";
import { getAuthUser } from "../../../../lib/auth";

function resolveUserId(request: NextRequest): string | null {
  const authUser = getAuthUser(request);
  return authUser ? authUser.userId : null;
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const userId = resolveUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      contestId,
      rank,
      rating,
      attended,
      questionsSolved,
      solvedLater,
      timeTaken,
    } = body;

    if (!contestId) {
      return NextResponse.json(
        { error: "contestId is required" },
        { status: 400 },
      );
    }

    const stat = await UserContestStatModel.findOneAndUpdate(
      { userId, contestId },
      {
        userId,
        contestId,
        attended: attended ?? true,
        solvedDuringContest: questionsSolved ?? 0,
        solvedLater: solvedLater ?? 0,
        rank: rank ?? null,
        timeTaken: timeTaken ?? null,
        rating: rating ?? null,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    const formatted = {
      contestId: stat.contestId,
      rank: stat.rank,
      rating: stat.rating,
      attended: stat.attended,
      questionsSolved: stat.solvedDuringContest,
      solvedLater: stat.solvedLater,
      timeTaken: stat.timeTaken,
    };

    return NextResponse.json({ contest: formatted }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/user/contests]", error);
    return NextResponse.json(
      { error: "Failed to save contest" },
      { status: 500 },
    );
  }
}
