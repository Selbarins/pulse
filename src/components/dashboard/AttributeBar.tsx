import type { Attribute } from "@/types/attributes";

interface Props {
  attribute: Attribute;
}

export function AttributeBar({ attribute }: Props) {
  const progress = Math.min(100, (attribute.currentXp / attribute.xpToNext) * 100);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm text-slate-300">
        <span className="capitalize font-medium">{attribute.name}</span>
        <span className="text-slate-400">
          Lv {attribute.level} · {attribute.multiplier.toFixed(2)}×
        </span>
      </div>

      <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-600/80 to-amber-400/90 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-slate-500">
        <span>{attribute.currentXp} XP</span>
        <span>{attribute.xpToNext} to next</span>
      </div>
    </div>
  );
}
