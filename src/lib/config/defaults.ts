/**
 * Default Season 1 config values.
 * Everything is overridable via the Config screen.
 */
export const DEFAULT_WEALTH_CONFIG = {
  monthlyIncomeTarget: 12000,
  monthlySurplusTarget: 2000,
  monthlyInvestmentTarget: 0,
  spendingCategories: [] as string[],
};

export const DEFAULT_VITALITY_CONFIG = {
  trainingFrequencyTarget: 3,
  trainingType: "strength" as const,
  glycemiaTargetRange: { min: 70, max: 130 }, // placeholder — set with doctor
  weightGoalDirection: "lose" as const,
};

export const DEFAULT_FOCUS_CONFIG = {
  dailyDeepWorkMinutes: 45,
  deepWorkTags: ["business"],
  taskCompletionTargetPct: 80,
};

export const DEFAULT_SEASON_CONFIG = {
  durationDays: 90,
  name: "Activate",
  successCriteria: [] as string[],
  bossEvaluationThreshold: 4,
};
