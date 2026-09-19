"use client";

import AttributeShell from "@/components/layout/AttributeShell";

export default function FocusPage() {
  const level01 = 0.2;

  return (
    <AttributeShell attribute="focus" level01={level01} title="Focus">
      <div className="space-y-6 mt-6">
        <section className="rounded-2xl bg-slate-900/60 p-4">
          <h2 className="text-sm font-medium text-blue-300 mb-2">Today</h2>
          <p className="text-slate-400 text-sm">Deep work · Tasks · Distractions time</p>
        </section>

        <section className="rounded-2xl bg-slate-900/60 p-4">
          <h2 className="text-sm font-medium text-slate-200 mb-2">Deep Work</h2>
          <p className="text-slate-500 text-sm">Coming soon</p>
        </section>

        <section className="rounded-2xl bg-slate-900/60 p-4">
          <h2 className="text-sm font-medium text-slate-200 mb-2">Tasks</h2>
          <p className="text-slate-500 text-sm">Coming soon</p>
        </section>

        <section className="rounded-2xl bg-slate-900/60 p-4">
          <h2 className="text-sm font-medium text-slate-200 mb-2">Business Idea Time</h2>
          <p className="text-slate-500 text-sm">Coming soon</p>
        </section>
      </div>
    </AttributeShell>
  );
}
