"use client";

import AttributeShell from "@/components/layout/AttributeShell";

export default function MomentumPage() {
  const level01 = 0.3;

  return (
    <AttributeShell attribute="momentum" level01={level01} title="Momentum">
      <div className="space-y-6 mt-6">
        <section className="rounded-2xl bg-slate-900/60 p-4">
          <h2 className="text-sm font-medium text-emerald-300 mb-2">Today</h2>
          <p className="text-slate-400 text-sm">Milestones · Wins · Projects</p>
        </section>

        <section className="rounded-2xl bg-slate-900/60 p-4">
          <h2 className="text-sm font-medium text-slate-200 mb-2">Weekly Milestones</h2>
          <p className="text-slate-500 text-sm">Coming soon</p>
        </section>

        <section className="rounded-2xl bg-slate-900/60 p-4">
          <h2 className="text-sm font-medium text-slate-200 mb-2">Active Projects</h2>
          <p className="text-slate-500 text-sm">Coming soon</p>
        </section>

        <section className="rounded-2xl bg-slate-900/60 p-4">
          <h2 className="text-sm font-medium text-slate-200 mb-2">Weekly Wins</h2>
          <p className="text-slate-500 text-sm">Coming soon</p>
        </section>
      </div>
    </AttributeShell>
  );
}
