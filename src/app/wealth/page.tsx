"use client";

import AttributeShell from "@/components/layout/AttributeShell";

export default function WealthPage() {
  const level01 = 0.4;

  return (
    <AttributeShell attribute="wealth" level01={level01} title="Wealth">
      <div className="space-y-6 mt-6">
        <section className="rounded-2xl bg-slate-900/60 p-4">
          <h2 className="text-sm font-medium text-amber-300 mb-2">Today</h2>
          <p className="text-slate-400 text-sm">Surplus · Spending · Investments</p>
        </section>

        <section className="rounded-2xl bg-slate-900/60 p-4">
          <h2 className="text-sm font-medium text-slate-200 mb-2">Income & Surplus</h2>
          <p className="text-slate-500 text-sm">Coming soon</p>
        </section>

        <section className="rounded-2xl bg-slate-900/60 p-4">
          <h2 className="text-sm font-medium text-slate-200 mb-2">Spending</h2>
          <p className="text-slate-500 text-sm">Coming soon</p>
        </section>

        <section className="rounded-2xl bg-slate-900/60 p-4">
          <h2 className="text-sm font-medium text-slate-200 mb-2">Investments</h2>
          <p className="text-slate-500 text-sm">Coming soon</p>
        </section>

        <section className="rounded-2xl bg-slate-900/60 p-4">
          <h2 className="text-sm font-medium text-slate-200 mb-2">Shopping List</h2>
          <p className="text-slate-500 text-sm">Coming soon</p>
        </section>
      </div>
    </AttributeShell>
  );
}
