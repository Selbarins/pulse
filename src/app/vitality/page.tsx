"use client";

import AttributeShell from "@/components/layout/AttributeShell";

export default function VitalityPage() {
  // temporary hardcoded level – later from real data
  const level01 = 0.35;

  return (
    <AttributeShell attribute="vitality" level01={level01} title="Vitality">
      <div className="space-y-6 mt-6">
        <section className="rounded-2xl bg-slate-900/60 p-4">
          <h2 className="text-sm font-medium text-pink-300 mb-2">Today</h2>
          <p className="text-slate-400 text-sm">Glycemia · Sleep · Training · Protein</p>
        </section>

        <section className="rounded-2xl bg-slate-900/60 p-4">
          <h2 className="text-sm font-medium text-slate-200 mb-2">Glycemia</h2>
          <p className="text-slate-500 text-sm">Coming soon</p>
        </section>

        <section className="rounded-2xl bg-slate-900/60 p-4">
          <h2 className="text-sm font-medium text-slate-200 mb-2">Sleep</h2>
          <p className="text-slate-500 text-sm">Coming soon</p>
        </section>

        <section className="rounded-2xl bg-slate-900/60 p-4">
          <h2 className="text-sm font-medium text-slate-200 mb-2">Musculation</h2>
          <p className="text-slate-500 text-sm">Coming soon</p>
        </section>

        <section className="rounded-2xl bg-slate-900/60 p-4">
          <h2 className="text-sm font-medium text-slate-200 mb-2">Nutrition</h2>
          <p className="text-slate-500 text-sm">Coming soon</p>
        </section>

        <section className="rounded-2xl bg-slate-900/60 p-4">
          <h2 className="text-sm font-medium text-slate-200 mb-2">Hygiene & Recovery</h2>
          <p className="text-slate-500 text-sm">Coming soon</p>
        </section>
      </div>
    </AttributeShell>
  );
}
