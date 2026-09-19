"use client";

import Link from "next/link";
import SoulOrb from "@/components/orb/SoulOrb";
import AttributeOrb from "@/components/orb/AttributeOrb";
import { orbStateFromStats } from "@/lib/orb/fromStats";
import type { Attribute } from "@/types/attributes";
import { useState } from "react";

const INITIAL: Attribute[] = [
  { name: "wealth", level: 3, currentXp: 420, xpToNext: 1000, multiplier: 1.1 },
  { name: "vitality", level: 2, currentXp: 180, xpToNext: 800, multiplier: 1.0 },
  { name: "focus", level: 1, currentXp: 90, xpToNext: 600, multiplier: 1.0 },
  { name: "momentum", level: 2, currentXp: 310, xpToNext: 800, multiplier: 1.0 },
  { name: "discipline", level: 4, currentXp: 50, xpToNext: 1200, multiplier: 1.25 },
];

// Arc layout: 5 orbs on a parabola, vitality at center (highest point)
// Order left→right: wealth, focus, vitality, momentum, discipline
// translateY values: outer pair dips most, inner pair dips less, center is baseline
const ARC_ITEMS = [
  { name: "wealth",     label: "Wealth",     href: "/wealth",     translateY: 52 },
  { name: "focus",      label: "Focus",      href: "/focus",      translateY: 22 },
  { name: "vitality",   label: "Vitality",   href: "/vitality",   translateY: 0  },
  { name: "momentum",   label: "Momentum",   href: "/momentum",   translateY: 22 },
  { name: "discipline", label: "Discipline", href: "/discipline", translateY: 52 },
] as const;

export default function Home() {
  const [attributes] = useState<Attribute[]>(INITIAL);
  const [streak] = useState(9);
  const [inDebt] = useState(false);

  const realState = orbStateFromStats(attributes, streak, inDebt);
  // temporary visual boost (remove later)
  const state = {
    ...realState,
    energy: 0.92,
    speed: 1.6,
    stability: 0.95,
    vitality: 0.85,
    wealth: 0.85,
    focus: 0.7,
    momentum: 0.8,
    discipline: 0.8,
    debt: false,
  };

  const level01 = (name: string) => {
    const attr = attributes.find((a) => a.name === name);
    return attr ? Math.min(1, Math.max(0, (attr.level - 1) / 19)) : 0;
  };

  return (
    <main className="min-h-screen bg-[#0B0D10] flex flex-col items-center px-4 pt-8 pb-16">
      {/* Soul Orb */}
      <div className="w-full max-w-md">
        <SoulOrb state={state} />
      </div>

      {/* Attribute Orbs — gentle arc, vitality at center */}
      <div className="w-full max-w-md mt-10 px-2">
        <div className="flex justify-between items-start">
          {ARC_ITEMS.map(({ name, label, href, translateY }) => (
            <Link
              key={name}
              href={href}
              className="flex flex-col items-center"
              style={{ transform: `translateY(${translateY}px)` }}
            >
              <AttributeOrb attribute={name} level01={level01(name)} size="sm" />
              <span className="text-[11px] text-slate-400 mt-1">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
