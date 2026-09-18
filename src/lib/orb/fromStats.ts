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

  const energy = Math.min(1, 0.25 + avgLevel * 0.08 + Math.min(streakDays, 30) * 0.012);
  const speed = 0.7 + Math.min(streakDays, 21) * 0.04 + (byName.momentum?.level ?? 0) * 0.03;
  const stability = inDebt ? 0.35 : Math.min(1, 0.5 + (byName.discipline?.level ?? 0) * 0.06 + streakDays * 0.01);

  return {
    energy: inDebt ? energy * 0.6 : energy,
    speed: Math.max(0.4, Math.min(2.2, speed)),
    stability,
    vitality: Math.min(1, (byName.vitality?.level ?? 0) * 0.12),
    wealth: Math.min(1, (byName.wealth?.level ?? 0) * 0.12),
  };
}
