import type { EdgeEvent } from "@/lib/multipliers/edge";

interface Props {
  edge: EdgeEvent;
}

export function EdgeBanner({ edge }: Props) {
  return (
    <div className="rounded border border-yellow-600/40 bg-yellow-950/30 px-3 py-2 text-sm">
      TODAY'S EDGE: {edge.description}
    </div>
  );
}
