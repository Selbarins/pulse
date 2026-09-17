import type { AttributeName } from "./attributes";

export interface QuestDefinition {
  id: string;
  name: string;
  attribute: AttributeName;
  baseXp: number;
  active: boolean;
}

export interface QuestCompletion {
  questId: string;
  date: string; // YYYY-MM-DD
  xpEarned: number;
  completedAt: string;
}
