export interface DailyLog {
  date: string;
  glycemiaMorning?: number;
  glycemiaPostmeal?: number;
  weightKg?: number;
  sleepHours?: number;
  sleepQuality?: 1 | 2 | 3 | 4 | 5;
  energyScore?: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

export interface TrainingSession {
  date: string;
  type: "strength" | "cardio" | "mixed";
  durationMin: number;
  intensity?: number;
  exercisesJson?: unknown;
  notes?: string;
  xpEarned: number;
}

export interface FinancialLog {
  date: string;
  income?: number;
  spendingJson?: Record<string, number>;
  surplus?: number;
  investmentAmount?: number;
  notes?: string;
}
