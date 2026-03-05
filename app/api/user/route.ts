import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import { UserContestStatModel } from "../../../models/UserContestStat";
import { UserQuestionModel } from "../../../models/UserQuestion";
import { getAuthUser } from "../../../lib/auth";
import { runMigration } from "../../../lib/migrate";

function resolveUserId(request: NextRequest): string | null {
  const authUser = getAuthUser(request);
  return authUser ? authUser.userId : null;
}

export async function GET(request: NextRequest) {
  try {
    await runMigration();
    await connectToDatabase();

    const userId = resolveUserId(request);
    if (!userId) {
      return NextResponse.json(
        { contests: [], questions: [] },
        { status: 200 },
      );
    }

    const [stats, questions] = await Promise.all([
      UserContestStatModel.find({ userId }).lean(),
      UserQuestionModel.find({ userId }).lean(),
    ]);

    const formattedContests = stats.map((s) => ({
      contestId: s.contestId,
      rank: s.rank,
      rating: s.rating,
      attended: s.attended,
      questionsSolved: s.solvedDuringContest,
      solvedLater: s.solvedLater,
      timeTaken: s.timeTaken,
    }));

    const formattedQuestions = questions.map((q) => ({
      id: q.questionId,
      contestId: q.contestId,
      title: q.title,
      difficulty: q.difficulty,
      topics: q.topics,
      solvedDuringContest: q.solvedDuringContest,
      dateSolved: q.dateSolved,
    }));

    return NextResponse.json(
      { contests: formattedContests, questions: formattedQuestions },
      { status: 200 },
    );
  } catch (error) {
    console.error("[GET /api/user]", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 },
    );
  }
}
