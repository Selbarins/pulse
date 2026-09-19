"use client";

import AttributeShell from "@/components/layout/AttributeShell";

export default function DisciplinePage() {
  const level01 = 0.55;

  return (
    <AttributeShell attribute="discipline" level01={level01} title="Discipline">
      <div className="space-y-6 mt-6">
        <section className="rounded-2xl bg-slate-900/60 p-4">
          <h2 className="text-sm font-medium text-red-300 mb-2">Today</h2>
          <p className="text-slate-400 text-sm">Streak · Consistency · Logging</p>
        </section>

        <section className="rounded-2xl bg-slate-900/60 p-4">
          <h2 className="text-sm font-medium text-slate-200 mb-2">Current Streak</h2>
          <p className="text-slate-500 text-sm">Coming soon</p>
        </section>

        <section className="rounded-2xl bg-slate-900/60 p-4">
          <h2 className="text-sm font-medium text-slate-200 mb-2">Weekly Boss Status</h2>
          <p className="text-slate-500 text-sm">Coming soon</p>
        </section>

        <section className="rounded-2xl bg-slate-900/60 p-4">
          <h2 className="text-sm font-medium text-slate-200 mb-2">Logging Consistency</h2>
          <p className="text-slate-500 text-sm">Coming soon</p>
        </section>
      </div>
    </AttributeShell>
  );
}
