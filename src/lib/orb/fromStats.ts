import type { Attribute } from "@/types/attributes";
import type { OrbVisualState } from "@/components/orb/SoulOrb";

/**
 * Maps live attributes + streak into the visual drivers the orb understands.
 * Pure function — easy to unit-test later.
 */
export function orbStateFromStats(
  attributes: Attribute[],
  streakDays = 0,
  inDebt = false
): OrbVisualState {
  const byName = Object.fromEntries(attributes.map((a) => [a.name, a]));

  const avgLevel =
    attributes.reduce((s, a) => s + a.level, 0) / Math.max(attributes.length, 1);

  const energy = Math.min(1, 0.2 + avgLevel * 0.09 + Math.min(streakDays, 30) * 0.015);
  const speed = 0.55 + Math.min(streakDays, 25) * 0.05 + (byName.momentum?.level ?? 0) * 0.04;
  const stability = inDebt
    ? 0.25
    : Math.min(1, 0.4 + (byName.discipline?.level ?? 0) * 0.07 + streakDays * 0.012);

  return {
    energy: inDebt ? energy * 0.55 : energy,
    speed: Math.max(0.35, Math.min(2.8, speed)),
    stability,
    vitality: Math.min(1, (byName.vitality?.level ?? 0) * 0.14),
    wealth: Math.min(1, (byName.wealth?.level ?? 0) * 0.14),
    debt: inDebt,
  };
}
