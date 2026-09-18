import type { Attribute } from "@/types/attributes";
import type { OrbVisualState } from "@/components/orb/SoulOrb";

/** level 1 → 0, level 20 → 1 */
function level01(level: number) {
  return Math.min(1, Math.max(0, (level - 1) / 19));
}

export function orbStateFromStats(
  attributes: Attribute[],
  streakDays = 0,
  inDebt = false
): OrbVisualState {
  const byName = Object.fromEntries(attributes.map((a) => [a.name, a]));

  const avgLevel =
    attributes.reduce((s, a) => s + a.level, 0) / Math.max(attributes.length, 1);

  // Energy: avg level 1→0.15, level 20→1 (+ small streak boost)
  const energy = Math.min(
    1,
    0.15 + level01(avgLevel) * 0.85 + Math.min(streakDays, 30) * 0.005
  );

  // Speed: base + momentum (1→20) + light streak
  const speed =
    0.45 +
    level01(byName.momentum?.level ?? 1) * 1.8 +
    Math.min(streakDays, 25) * 0.02;

  // Stability: discipline 1→20; debt collapses it
  const stability = inDebt
    ? 0.22
    : Math.min(1, 0.3 + level01(byName.discipline?.level ?? 1) * 0.7 + Math.min(streakDays, 30) * 0.005);

  return {
    energy: inDebt ? energy * 0.5 : energy,
    speed: Math.max(0.3, Math.min(2.8, speed)),
    stability,
    vitality: level01(byName.vitality?.level ?? 1),
    wealth: level01(byName.wealth?.level ?? 1),
    focus: level01(byName.focus?.level ?? 1),
    momentum: level01(byName.momentum?.level ?? 1),
    discipline: level01(byName.discipline?.level ?? 1),
    debt: inDebt,
  };
}
