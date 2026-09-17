/**
 * Daily Edge event generator.
 * One random event activates at daily reset (00:00 Casablanca).
 */
export type EdgeTarget = "vitality" | "wealth" | "focus" | "momentum" | "any";

export interface EdgeEvent {
  description: string;
  target: EdgeTarget;
  multiplier: number; // e.g. 1.4 for +40%
}

// TODO: implement random selection from a pool of Edge definitions
export function generateDailyEdge(_date: string): EdgeEvent {
  return {
    description: "Placeholder Edge — implement pool",
    target: "any",
    multiplier: 1.0,
  };
}
