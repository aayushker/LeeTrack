import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUserQuestion extends Document {
  userId: Types.ObjectId;
  questionId: string; // original id from user.json
  contestId: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topics: string[];
  solvedDuringContest: boolean;
  dateSolved: Date;
}

const UserQuestionSchema = new Schema<IUserQuestion>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    questionId: { type: String, required: true },
    contestId: { type: String, required: true },
    title: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    topics: [{ type: String }],
    solvedDuringContest: { type: Boolean, default: true },
    dateSolved: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

UserQuestionSchema.index({ userId: 1, questionId: 1 }, { unique: true });

export const UserQuestionModel: Model<IUserQuestion> =
  mongoose.models.UserQuestion ||
  mongoose.model<IUserQuestion>("UserQuestion", UserQuestionSchema);
