import SoulOrb from "@/components/orb/SoulOrb";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0D10] flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-semibold text-slate-100 mb-6 tracking-wide">
        Pulse
      </h1>

      <div className="w-full max-w-md">
        <SoulOrb />
      </div>

      <p className="mt-6 text-slate-400 text-sm">
        Soul Orb — first version
      </p>
    </main>
  );
}
