import type { Attribute } from "@/types/attributes";
import type { OrbVisualState } from "@/components/orb/SoulOrb";

/**
 * Maps live attributes + streak into the visual drivers the orb understands.
 * Stronger curves so levels visibly change color / motion / tightness.
 */
export function orbStateFromStats(
  attributes: Attribute[],
  streakDays = 0,
  inDebt = false
): OrbVisualState {
  const byName = Object.fromEntries(attributes.map((a) => [a.name, a]));

  const avgLevel =
    attributes.reduce((s, a) => s + a.level, 0) / Math.max(attributes.length, 1);

  // Energy: overall level + streak (low energy → dimmer, sparser)
  const energy = Math.min(
    1,
    0.15 + avgLevel * 0.1 + Math.min(streakDays, 30) * 0.018
  );

  // Speed: momentum + streak
  const speed =
    0.5 +
    Math.min(streakDays, 25) * 0.04 +
    (byName.momentum?.level ?? 0) * 0.06;

  // Stability: discipline + streak; debt collapses it
  const stability = inDebt
    ? 0.22
    : Math.min(1, 0.35 + (byName.discipline?.level ?? 0) * 0.08 + streakDays * 0.014);

  // level 1 → ~0 (neutral), level 20 → 1 (full vivid)
  const attr = (name: string) => {
    const level = byName[name]?.level ?? 1;
    return Math.min(1, Math.max(0, (level - 1) / 19));
  };

  return {
    energy: inDebt ? energy * 0.5 : energy,
    speed: Math.max(0.3, Math.min(2.8, speed)),
    stability,
    vitality: attr("vitality"),
    wealth: attr("wealth"),
    focus: attr("focus"),
    momentum: attr("momentum"),
    discipline: attr("discipline"),
    debt: inDebt,
  };
}
