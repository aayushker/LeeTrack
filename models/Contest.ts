import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContest extends Document {
  contestId: string; // e.g. "weekly-491"
  contestType: "weekly" | "biweekly";
  contestNumber: number;
  title: string;
  date: Date;
  totalProblems: number;
  url: string;
}

const ContestSchema = new Schema<IContest>(
  {
    contestId: { type: String, required: true, unique: true },
    contestType: { type: String, enum: ["weekly", "biweekly"], required: true },
    contestNumber: { type: Number, required: true },
    title: { type: String, required: true },
    date: { type: Date, required: true },
    totalProblems: { type: Number, default: 4 },
    url: { type: String, default: "" },
  },
  { timestamps: true },
);

export const ContestModel: Model<IContest> =
  mongoose.models.Contest || mongoose.model<IContest>("Contest", ContestSchema);
