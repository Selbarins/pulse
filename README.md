# Pulses — Project Memory v4

*Last updated: 19 September 2026*

> This document is the canonical project memory for humans and AI agents.  
> Prefer this file over scattered comments or old conversations when making decisions.

---

## Identity

| Field | Value |
|---|---|
| **App name** | Pulses |
| **Previous names** | Pulse, Life RPG, Personal Performance Engine |
| **Type** | Single-player life RPG / personal performance system |
| **User** | One person — the builder. This is not a product. It is a personal weapon. |
| **Timezone** | Africa/Casablanca (GMT+1) |
| **Daily reset** | 00:00 Casablanca time |
| **Live URL** | https://getpulses.vercel.app |
| **Repo** | https://github.com/Selbarins/pulses |

---

## One-Line Pitch

A single-player life RPG where real-world actions in money, health, time and projects generate XP, levels, multipliers and tangible rewards. The only score that matters is measurable ROI — more money, better health, sharper focus and visible progress.

---

## The Player

This app has exactly one user. Everything is built around his reality.

| Dimension | Current Reality | Target |
|---|---|---|
| **Income** | ~12,000/month (MAD or EUR — confirm) | Grow + deploy intentionally |
| **Investments** | None yet | €500/mo habit by end of Season 1 |
| **Business** | Employed. Business ownership is the ultimate goal. | Named business direction by Day 90 |
| **Training** | None currently | 3×/week strength + muscle building |
| **Sleep** | Problem area | Tracked, improving, consistent |
| **Health conditions** | Type 2 / diabetic — glycemia is a core daily metric | Daily glycemia log, training improves sensitivity |
| **Weight** | Tracked | Logged weekly, trending direction matters |
| **Focus blocker** | Pressure to succeed → paralysis | Break big goal into small provable wins |
| **Logging style** | Willing to be disciplined | Full daily logging acceptable, but keep actions under 60 seconds each |

---

## Core Fantasy

You are the player character.  
Every real action you take feeds the game.  
The game tracks hard stats, awards XP and levels, applies temporary and permanent multipliers, and turns discipline into visible progression and real-life gains.

No philosophical journaling. No soft life-admin.  
Pure performance loop with **money** and **health** as the primary currencies.

---

## Primary Goals (ROI — priority order)

1. **Wealth** — Higher surplus, first investments, net-worth growth, business foundation  
2. **Vitality** — Consistent training, blood sugar control, weight trend, sleep quality  
3. **Focus** — Deep work hours on business idea, daily output quality  
4. **Momentum** — Project milestones, weekly wins, habit adherence  
5. **Discipline** — Streak strength, consistency score across all attributes  

> Money and Health receive the strongest XP weighting at launch. Focus and Momentum unlock deeper mechanics in Season 2.

---

## Character Stats (The Five Attributes)

Levels run **1 → 20**.

### 💰 Wealth
Financial health and forward momentum.  
Monthly income, surplus, investment contribution, spending leakage, net-worth snapshot, business idea progress.

### ❤️ Vitality
Physical health with diabetic-aware design.  
Training sessions, morning glycemia, weight, sleep quality (1–5), daily energy score (1–5).  
Consistent training applies passive Vitality multiplier + secondary Wealth buff.

### 🎯 Focus
Cognitive output quality.  
Deep work blocks, task completion rate, low-value time, business-idea time.

### 🚀 Momentum
Project and life progress.  
Weekly milestones, active projects, weekly wins, habit adherence.

### 🔒 Discipline
Meta-attribute calculated automatically from consistency across all other stats.  
Daily quest streak, weekly boss completion rate, logging consistency.

---

## Soul Orb (Visual Core)

The Soul Orb is the main visual focus of the app.  
Living particle constellation (React Three Fiber + custom GLSL shaders).  
No text or numbers on the orb — pure visual language.

**Dominant healthy color:** soft white-gold.

### Current Motion Model (locked)

Attributes drive continuous blended movement (not discrete modes):

| Attribute    | Kinetic identity              | Behaviour |
|--------------|-------------------------------|---------|
| **Momentum** | Liquid flow                   | Strong tangential streaming across particles |
| **Discipline**| Soft ordered cloud           | Gentle lock toward clean radius, reduced noise |
| **Vitality** | Organic breath                | Soft radial pulse / expand-contract |
| **Wealth**   | Limited filaments             | Selected particles stretch outward slightly (max ~10–12%) |
| **Focus**    | Soft geometric order          | Pull toward cleaner surface + latitude banding |
| **Debt**     | Clearly broken                | High-frequency jitter, sag, cold/dark color, occasional glitches |

All attributes scale continuously from level 1 → 20 and blend every frame.  
Debt acts as a strong corrupting field that partially overrides positive layers.

**Technical location:** `src/components/orb/SoulOrb.tsx`  
**State mapping:** `src/lib/orb/fromStats.ts` (levels 1–20 → 0–1 drivers)

**Current status (Sep 2026):**
- Full shader-based particle system live
- Attribute-driven motion implemented
- Visual state wired from stats
- Presets available for testing different looks
- Mobile performance prioritized

---

## Game Systems (Season 1)

### Daily Quests
Fast logging (target < 60 s each). Core set includes glycemia, weight, sleep, energy, training, spending, deep work, surplus decisions.

### Weekly Bosses
Larger targets with real rewards on success and **Debt State** on failure.  
Debt diverts 25% of new XP until repaid. Max one active debt at a time.

### Compound Interest (Streak Multiplier)
| Streak | Multiplier |
|--------|------------|
| 3–6 days | 1.1× |
| 7–13 | 1.25× |
| 14–20 | 1.5× |
| 21–29 | 1.75× |
| 30+ | 2.0× (cap) |

Breaking resets to 1.0×. Recovery takes half the original time.

### Other systems
- Anti-inflation / scaling difficulty  
- Edge system (daily variable multipliers)  
- Real-money economy (locked vs unlocked capital)  
- Action Points (AP) pool modified by sleep  
- Shadow Self (personal historical best week as benchmark)

---

## Technical Stack

- **Framework:** Next.js 15 (App Router) + React 19
- **3D:** React Three Fiber 9 + Three.js + custom GLSL
- **Backend / Auth / DB:** Supabase
- **Hosting:** Vercel → https://getpulses.vercel.app
- **PWA:** In progress (manifest + apple-touch-icon for iPhone home-screen install)

### Key files for agents

| Concern | Location |
|---------|----------|
| Soul Orb visual + motion | `src/components/orb/SoulOrb.tsx` |
| Stats → visual drivers | `src/lib/orb/fromStats.ts` |
| App metadata / PWA | `src/app/layout.tsx`, `src/app/manifest.ts` |
| Icons | `/public/apple-touch-icon.png`, `icon-192.png`, `icon-512.png` |
| Attribute types | `src/types/attributes.ts` |

---

## Current Build Status (Sep 2026)

**Done**
- Rebrand to **Pulses**
- Live deployment at getpulses.vercel.app
- Full shader Soul Orb with attribute motion language
- Level 1–20 mapping
- Basic dashboard + attribute bars
- Project memory structure

**In progress / next**
- Finish PWA icons + full standalone mode on iPhone
- Wire live Supabase data into orb + dashboard
- Daily quest logging flow
- Debt state UI + recovery
- Edge system
- Real money tracking

**Not started yet**
- Weekly bosses full loop
- Shadow Self
- Season system
- Investment pipeline

---

## Design & Agent Rules

1. This is a **personal weapon**, not a consumer product. Optimize for the single user’s reality.
2. Prefer measurable ROI (money + health) over soft metrics.
3. Soul Orb must never show text or numbers.
4. Motion language is locked (liquid Momentum, soft ordered Discipline, etc.). Do not revert to discrete modes.
5. Keep daily actions under 60 seconds.
6. Mobile performance matters.
7. When in doubt, update this Project Memory file rather than inventing new systems.

---

*This document is the locked project vision and living memory. Formulas, quest XP values and exact unlock tables can be refined. The core fantasy, five attributes, Soul Orb motion language, ROI priority and single-player nature are stable.*
