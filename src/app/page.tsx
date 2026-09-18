"use client";

import { useState } from "react";
import SoulOrb from "@/components/orb/SoulOrb";
import { AttributeBar } from "@/components/dashboard/AttributeBar";
import { orbStateFromStats } from "@/lib/orb/fromStats";
import type { Attribute } from "@/types/attributes";

const INITIAL: Attribute[] = [
  { name: "wealth", level: 3, currentXp: 420, xpToNext: 1000, multiplier: 1.1 },
  { name: "vitality", level: 2, currentXp: 180, xpToNext: 800, multiplier: 1.0 },
  { name: "focus", level: 1, currentXp: 90, xpToNext: 600, multiplier: 1.0 },
  { name: "momentum", level: 2, currentXp: 310, xpToNext: 800, multiplier: 1.0 },
  { name: "discipline", level: 4, currentXp: 50, xpToNext: 1200, multiplier: 1.25 },
];

export default function Home() {
  const [attributes, setAttributes] = useState<Attribute[]>(INITIAL);
  const [streak, setStreak] = useState(9);
  const [inDebt, setInDebt] = useState(false);

  const state = orbStateFromStats(attributes, streak, inDebt);

  const bump = (name: Attribute["name"], delta: number) => {
    setAttributes((prev) =>
      prev.map((a) =>
        a.name === name
          ? { ...a, level: Math.max(1, Math.min(20, a.level + delta)) }
          : a
      )
    );
  };

  return (
    <main className="min-h-screen bg-[#0B0D10] flex flex-col items-center p-4 pb-20">
      <h1 className="text-2xl font-semibold text-slate-100 mb-4 tracking-wide">
        Pulse — Orb Lab
      </h1>

      <div className="w-full max-w-md">
        <SoulOrb state={state} showMood />
      </div>

      <div className="mt-4 text-xs text-slate-500 font-mono text-center space-y-1">
        <div>
          energy {state.energy.toFixed(2)} · speed {state.speed.toFixed(2)} ·
          stability {state.stability.toFixed(2)}
        </div>
        <div>
          wealth {state.wealth.toFixed(2)} · vitality {state.vitality.toFixed(2)} ·
          focus {state.focus.toFixed(2)}
        </div>
        <div>
          momentum {state.momentum.toFixed(2)} · discipline {state.discipline.toFixed(2)}
          {state.debt ? " · DEBT" : ""}
        </div>
      </div>

      <div className="w-full max-w-md mt-6 space-y-4">
        <div className="flex items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Streak</span>
            <button
              onClick={() => setStreak((s) => Math.max(0, s - 1))}
              className="px-2 py-1 rounded bg-slate-800 text-slate-200"
            >
              –
            </button>
            <span className="w-8 text-center text-amber-400 font-medium">{streak}</span>
            <button
              onClick={() => setStreak((s) => s + 1)}
              className="px-2 py-1 rounded bg-slate-800 text-slate-200"
            >
              +
            </button>
          </div>

          <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={inDebt}
              onChange={(e) => setInDebt(e.target.checked)}
              className="accent-amber-500"
            />
            Debt
          </label>
        </div>

        {attributes.map((attr) => (
          <div key={attr.name} className="space-y-1">
            <AttributeBar attribute={attr} />
            <div className="flex gap-2">
              <button
                onClick={() => bump(attr.name, -1)}
                className="flex-1 py-1 text-xs rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                – Level
              </button>
              <button
                onClick={() => bump(attr.name, 1)}
                className="flex-1 py-1 text-xs rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                + Level
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
