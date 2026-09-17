export interface BossDefinition {
  id: string;
  name: string;
  conditionDescription: string;
  rewardXp: number;
  active: boolean;
  threshold: number; // editable via config
}

export interface BossResult {
  weekStart: string;
  bossId: string;
  completed: boolean;
  debtRemaining: number;
  rewardEarned: number;
}
