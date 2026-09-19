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

  const state = orbStateFromStats(attributes, streak, inDebt);

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

      {/* 5 Attribute Orbs – clean row */}
      <div className="w-full max-w-md mt-8 grid grid-cols-5 gap-2">
        {ATTR_META.map((a) => (
          <Link key={a.name} href={a.href} className="flex flex-col items-center gap-1">
            <AttributeOrb attribute={a.name} level01={level01(a.name)} size="sm" />
            <span className="text-[11px] text-slate-400 tracking-wide">{a.label}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
