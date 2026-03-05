/**
 * Migration script: seeds MongoDB from data.json and user.json.
 * Safe to run multiple times — uses upsert/findOrCreate patterns.
 */
import { connectToDatabase } from "./mongodb";
import { ContestModel } from "../models/Contest";
import path from "path";
import fs from "fs";

interface RawContest {
  id: string;
  title: string;
  type: string;
  date: string;
  contestNumber: number;
  url: string;
}

let migrated = false; // In-process guard so we only run once per server boot

export async function runMigration() {
  if (migrated) return;
  migrated = true;

  await connectToDatabase();

  // ── 1. Migrate contests from data.json ──────────────────────────────────────
  const dataPath = path.join(process.cwd(), "data.json");
  if (fs.existsSync(dataPath)) {
    const raw = JSON.parse(fs.readFileSync(dataPath, "utf-8")) as {
      contests: RawContest[];
    };
    const ops = raw.contests.map((c: RawContest) => ({
      updateOne: {
        filter: { contestId: c.id },
        update: {
          $setOnInsert: {
            contestId: c.id,
            contestType: (c.type?.toLowerCase() === "biweekly"
              ? "biweekly"
              : "weekly") as "weekly" | "biweekly",
            contestNumber: c.contestNumber,
            title: c.title,
            date: new Date(c.date),
            totalProblems: 4,
            url: c.url || "",
          },
        },
        upsert: true,
      },
    }));
    if (ops.length) {
      await ContestModel.bulkWrite(ops, { ordered: false });
      console.log(`[Migration] Upserted ${ops.length} contests.`);
    }
  }

  console.log("[Migration] Complete.");
}
