import SoulOrb from "@/components/orb/SoulOrb";
import { AttributeBar } from "@/components/dashboard/AttributeBar";
import { orbStateFromStats } from "@/lib/orb/fromStats";
import type { Attribute } from "@/types/attributes";

const MOCK_ATTRIBUTES: Attribute[] = [
  { name: "wealth", level: 3, currentXp: 420, xpToNext: 1000, multiplier: 1.1 },
  { name: "vitality", level: 2, currentXp: 180, xpToNext: 800, multiplier: 1.0 },
  { name: "focus", level: 1, currentXp: 90, xpToNext: 600, multiplier: 1.0 },
  { name: "momentum", level: 2, currentXp: 310, xpToNext: 800, multiplier: 1.0 },
  { name: "discipline", level: 4, currentXp: 50, xpToNext: 1200, multiplier: 1.25 },
];

export default function Home() {
  const state = orbStateFromStats(MOCK_ATTRIBUTES, 9);

  return (
    <main className="min-h-screen bg-[#0B0D10] flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-semibold text-slate-100 mb-6 tracking-wide">
        Pulse
      </h1>

      <div className="w-full max-w-md">
        <SoulOrb state={state} />
      </div>

      {/* Attributes */}
      <div className="w-full max-w-md mt-8 space-y-4">
        {MOCK_ATTRIBUTES.map((attr) => (
          <AttributeBar key={attr.name} attribute={attr} />
        ))}
      </div>
    </main>
  );
}
