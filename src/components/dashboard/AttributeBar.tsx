import type { Attribute } from "@/types/attributes";

interface Props {
  attribute: Attribute;
}

export function AttributeBar({ attribute }: Props) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="capitalize">{attribute.name}</span>
        <span>Lv {attribute.level}</span>
      </div>
      {/* TODO: progress bar using currentXp / xpToNext */}
    </div>
  );
}
