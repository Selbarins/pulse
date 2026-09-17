# Pulse Architecture

## Principles

- **Small files, many folders** — every domain (XP, multipliers, config, logs, components) lives in its own module so editing stays light even when the codebase grows heavy.
- **Single player** — no multi-tenant complexity; auth is one user.
- **Config over hardcode** — all targets live in `player_config`; history never rewritten.
- **Free-tier first** — Next.js on Vercel + Supabase free tier.

## Folder Map

```
src/
  app/                  # Next.js App Router pages & layouts
    (auth)/login/
    dashboard/
    config/
  components/
    dashboard/          # AttributeBar, etc.
    quests/
    vitality/           # future
    wealth/             # future
    focus/              # future
    shared/             # EdgeBanner, etc.
  lib/
    supabase/           # client, server, types
    xp/                 # leveling + calculator
    multipliers/        # streak + edge
    config/             # defaults
  types/                # pure TypeScript interfaces (no runtime)
  hooks/                # future React hooks

supabase/
  migrations/           # numbered SQL files (one concern per file)
```

## Data Flow (high level)

1. Daily reset (00:00 Africa/Casablanca) → generate Edge event.
2. User logs actions → quest_completions + domain logs → XP applied with multipliers.
3. Weekly evaluation → boss_results + possible debt state.
4. Config changes → player_config + config_change_log / pivot_events.

## Why this structure scales

- Adding a new quest type only touches `types/quests.ts` + one component file.
- Schema growth = new migration file, never a giant `schema.sql`.
- Domain logic (XP, streaks, debt) stays pure functions in `lib/` — easy to unit-test later.
