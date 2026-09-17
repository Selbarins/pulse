/**
 * XP required to reach a given level.
 * Formula: XP_required = 1000 × level^1.4
 */
export function xpRequiredForLevel(level: number): number {
  return Math.round(1000 * Math.pow(level, 1.4));
}

export function cumulativeXpToLevel(level: number): number {
  let total = 0;
  for (let i = 1; i <= level; i++) {
    total += xpRequiredForLevel(i);
  }
  return total;
}
