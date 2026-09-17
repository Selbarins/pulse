import type { QuestDefinition } from "@/types/quests";

interface Props {
  quests: QuestDefinition[];
  completedIds: string[];
}

export function QuestList({ quests, completedIds }: Props) {
  return (
    <ul className="space-y-2">
      {quests.map((q) => (
        <li key={q.id} className="flex items-center gap-2 text-sm">
          <span>{completedIds.includes(q.id) ? "✅" : "⬜"}</span>
          <span>{q.name}</span>
          <span className="text-muted-foreground">+{q.baseXp} XP</span>
        </li>
      ))}
    </ul>
  );
}
