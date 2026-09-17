/**
 * Applies streak + edge multipliers to base XP.
 * Keep this pure — no side effects.
 */
export function applyMultipliers(
  baseXp: number,
  streakMultiplier: number = 1,
  edgeMultiplier: number = 1
): number {
  return Math.round(baseXp * streakMultiplier * edgeMultiplier);
}
