import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUserContestStat extends Document {
  userId: Types.ObjectId;
  contestId: string;
  attended: boolean;
  solvedDuringContest: number;
  solvedLater: number;
  rank: number | null;
  timeTaken: string | null;
  rating: number | null;
}

const UserContestStatSchema = new Schema<IUserContestStat>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    contestId: { type: String, required: true },
    attended: { type: Boolean, default: false },
    solvedDuringContest: { type: Number, default: 0 },
    solvedLater: { type: Number, default: 0 },
    rank: { type: Number, default: null },
    timeTaken: { type: String, default: null },
    rating: { type: Number, default: null },
  },
  { timestamps: true },
);

// Compound unique: one stat record per user per contest
UserContestStatSchema.index({ userId: 1, contestId: 1 }, { unique: true });

export const UserContestStatModel: Model<IUserContestStat> =
  mongoose.models.UserContestStat ||
  mongoose.model<IUserContestStat>("UserContestStat", UserContestStatSchema);
