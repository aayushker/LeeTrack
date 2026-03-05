import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongodb";
import { UserQuestionModel } from "../../../../models/UserQuestion";
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
      title,
      difficulty,
      topics,
      solvedDuringContest,
      dateSolved,
    } = body;

    if (!contestId || !title) {
      return NextResponse.json(
        { error: "contestId and title are required" },
        { status: 400 },
      );
    }

    const questionId = body.id || Math.random().toString(36).substr(2, 9);

    const question = await UserQuestionModel.findOneAndUpdate(
      { userId, questionId },
      {
        userId,
        questionId,
        contestId,
        title,
        difficulty: difficulty || "Easy",
        topics: topics || [],
        solvedDuringContest: solvedDuringContest ?? true,
        dateSolved: dateSolved ? new Date(dateSolved) : new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    const formatted = {
      id: question.questionId,
      contestId: question.contestId,
      title: question.title,
      difficulty: question.difficulty,
      topics: question.topics,
      solvedDuringContest: question.solvedDuringContest,
      dateSolved: question.dateSolved,
    };

    return NextResponse.json({ question: formatted }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/user/questions]", error);
    return NextResponse.json(
      { error: "Failed to save question" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();
    const userId = resolveUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { id, title, difficulty, topics, solvedDuringContest } = body;
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    const question = await UserQuestionModel.findOneAndUpdate(
      { userId, questionId: id },
      { title, difficulty, topics, solvedDuringContest },
      { new: true },
    );
    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 },
      );
    }
    const formatted = {
      id: question.questionId,
      contestId: question.contestId,
      title: question.title,
      difficulty: question.difficulty,
      topics: question.topics,
      solvedDuringContest: question.solvedDuringContest,
      dateSolved: question.dateSolved,
    };
    return NextResponse.json({ question: formatted });
  } catch (error) {
    console.error("[PUT /api/user/questions]", error);
    return NextResponse.json(
      { error: "Failed to update question" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();
    const userId = resolveUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get("id");
    if (!questionId) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    await UserQuestionModel.deleteOne({ userId, questionId });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/user/questions]", error);
    return NextResponse.json(
      { error: "Failed to delete question" },
      { status: 500 },
    );
  }
}
