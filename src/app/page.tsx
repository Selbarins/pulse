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

const ATTR_META = [
  { name: "wealth", label: "Wealth", href: "/wealth" },
  { name: "vitality", label: "Vitality", href: "/vitality" },
  { name: "focus", label: "Focus", href: "/focus" },
  { name: "momentum", label: "Momentum", href: "/momentum" },
  { name: "discipline", label: "Discipline", href: "/discipline" },
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
    {/* Big Soul Orb */}
    <div className="w-full max-w-md">
      <SoulOrb state={state} />
    </div>

    {/* 5 Attribute Orbs – Arc layout */}
    <div className="w-full max-w-sm mt-12 relative h-44">
      {/* Top center - Focus */}
      <Link
        href="/focus"
        className="absolute left-1/2 -translate-x-1/2 top-0 flex flex-col items-center gap-1"
      >
        <AttributeOrb attribute="focus" level01={level01("focus")} size="sm" />
        <span className="text-[11px] text-slate-400 tracking-wide">Focus</span>
      </Link>

      {/* Upper left - Wealth */}
      <Link
        href="/wealth"
        className="absolute left-2 top-10 flex flex-col items-center gap-1"
      >
        <AttributeOrb attribute="wealth" level01={level01("wealth")} size="sm" />
        <span className="text-[11px] text-slate-400 tracking-wide">Wealth</span>
      </Link>

      {/* Upper right - Vitality */}
      <Link
        href="/vitality"
        className="absolute right-2 top-10 flex flex-col items-center gap-1"
      >
        <AttributeOrb attribute="vitality" level01={level01("vitality")} size="sm" />
        <span className="text-[11px] text-slate-400 tracking-wide">Vitality</span>
      </Link>

      {/* Lower left - Momentum */}
      <Link
        href="/momentum"
        className="absolute left-8 bottom-0 flex flex-col items-center gap-1"
      >
        <AttributeOrb attribute="momentum" level01={level01("momentum")} size="sm" />
        <span className="text-[11px] text-slate-400 tracking-wide">Momentum</span>
      </Link>

      {/* Lower right - Discipline */}
      <Link
        href="/discipline"
        className="absolute right-8 bottom-0 flex flex-col items-center gap-1"
      >
        <AttributeOrb attribute="discipline" level01={level01("discipline")} size="sm" />
        <span className="text-[11px] text-slate-400 tracking-wide">Discipline</span>
      </Link>
    </div>
  </main>
);
}
