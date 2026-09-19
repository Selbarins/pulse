"use client";

import Link from "next/link";
import SoulOrb from "@/components/orb/SoulOrb";
import AttributeOrb from "@/components/orb/AttributeOrb";
import { orbStateFromStats } from "@/lib/orb/fromStats";
import type { Attribute } from "@/types/attributes";
import { useState, useEffect, useRef } from "react";

const INITIAL: Attribute[] = [
  { name: "wealth",     level: 3, currentXp: 420, xpToNext: 1000, multiplier: 1.1  },
  { name: "vitality",  level: 2, currentXp: 180, xpToNext: 800,  multiplier: 1.0  },
  { name: "focus",     level: 1, currentXp: 90,  xpToNext: 600,  multiplier: 1.0  },
  { name: "momentum",  level: 2, currentXp: 310, xpToNext: 800,  multiplier: 1.0  },
  { name: "discipline",level: 4, currentXp: 50,  xpToNext: 1200, multiplier: 1.25 },
];

// Left→right order, vitality at center (index 2)
// translateY: outer orbs sit higher (negative = up), center dips down → inverted arc
const ARC_ITEMS = [
  { name: "wealth",     label: "Wealth",     href: "/wealth",     color: "#E8B84A", ty: -48 },
  { name: "focus",      label: "Focus",      href: "/focus",      color: "#60A5FA", ty: -20 },
  { name: "vitality",   label: "Vitality",   href: "/vitality",   color: "#F472B6", ty: 0   },
  { name: "momentum",   label: "Momentum",   href: "/momentum",   color: "#34D399", ty: -20 },
  { name: "discipline", label: "Discipline", href: "/discipline", color: "#F87171", ty: -48 },
] as const;

// Particle config per stream
const PARTICLE_COUNT = 6;

interface Particle {
  t: number;       // 0–1 progress along path
  speed: number;   // units/sec
  size: number;    // radius px
  opacity: number;
}

// Quadratic bezier point
function bezier(p0: number, p1: number, p2: number, t: number) {
  return (1 - t) ** 2 * p0 + 2 * (1 - t) * t * p1 + t ** 2 * p2;
}

export default function Home() {
  const [attributes] = useState<Attribute[]>(INITIAL);
  const [streak]     = useState(9);
  const [inDebt]     = useState(false);

  const realState = orbStateFromStats(attributes, streak, inDebt);
  const state = {
    ...realState,
    energy: 0.92, speed: 1.6, stability: 0.95,
    vitality: 0.85, wealth: 0.85, focus: 0.7,
    momentum: 0.8, discipline: 0.8, debt: false,
  };

  const level01 = (name: string) => {
    const attr = attributes.find((a) => a.name === name);
    return attr ? Math.min(1, Math.max(0, (attr.level - 1) / 19)) : 0;
  };

  // ── Flow animation ─────────────────────────────────────────────────────────
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbRowRef    = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number>(0);

  // One set of particles per stream (5 streams)
  const particles = useRef<Particle[][]>(
    ARC_ITEMS.map(() =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        t:       i / PARTICLE_COUNT,
        speed:   0.18 + Math.random() * 0.1,
        size:    1.5 + Math.random() * 1.5,
        opacity: 0.4 + Math.random() * 0.5,
      }))
    )
  );

  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    const orbRow    = orbRowRef.current;
    if (!canvas || !container || !orbRow) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastTime = performance.now();

    const getOrbCenters = () => {
      const containerRect = container.getBoundingClientRect();
      const links = orbRow.querySelectorAll("a");
      return Array.from(links).map((link) => {
        const rect = link.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2 - containerRect.left,
          y: rect.top  + rect.height / 2 - containerRect.top,
        };
      });
    };

    const getSoulOrbCenter = () => {
      const containerRect = container.getBoundingClientRect();
      // SoulOrb canvas is the first child of container
      const soulDiv = container.querySelector(".soul-orb-wrapper") as HTMLElement;
      if (!soulDiv) return { x: canvas.width / 2, y: 190 };
      const rect = soulDiv.getBoundingClientRect();
      return {
        x: rect.left + rect.width  / 2 - containerRect.left,
        y: rect.top  + rect.height / 2 - containerRect.top,
      };
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width  = rect.width;
      canvas.height = rect.height;
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const draw = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const soul   = getSoulOrbCenter();
      const centers = getOrbCenters();

      ARC_ITEMS.forEach((item, idx) => {
        const orb = centers[idx];
        if (!orb) return;

        // Control point: midpoint pulled toward soul orb horizontally
        const cpx = (orb.x + soul.x) / 2;
        const cpy = (orb.y + soul.y) / 2 - 40; // slight upward bow on path

        const stream = particles.current[idx];

        stream.forEach((p) => {
          // advance
          p.t += delta * p.speed;
          if (p.t > 1) {
            p.t     = 0;
            p.speed   = 0.18 + Math.random() * 0.1;
            p.size    = 1.5  + Math.random() * 1.5;
            p.opacity = 0.4  + Math.random() * 0.5;
          }

          // fade in near start, fade out near soul
          const fade = p.t < 0.15
            ? p.t / 0.15
            : p.t > 0.75
            ? 1 - (p.t - 0.75) / 0.25
            : 1;

          const px = bezier(orb.x, cpx, soul.x, p.t);
          const py = bezier(orb.y, cpy, soul.y, p.t);

          // glow
          const grd = ctx.createRadialGradient(px, py, 0, px, py, p.size * 3);
          grd.addColorStop(0,   item.color + "cc");
          grd.addColorStop(0.4, item.color + "55");
          grd.addColorStop(1,   item.color + "00");

          ctx.globalAlpha = p.opacity * fade;
          ctx.fillStyle   = grd;
          ctx.beginPath();
          ctx.arc(px, py, p.size * 3, 0, Math.PI * 2);
          ctx.fill();

          // bright core dot
          ctx.globalAlpha = p.opacity * fade * 0.9;
          ctx.fillStyle   = item.color;
          ctx.beginPath();
          ctx.arc(px, py, p.size * 0.6, 0, Math.PI * 2);
          ctx.fill();
        });
      });

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#0B0D10] flex flex-col items-center pb-16">
      {/* Shared positioning container for canvas overlay */}
      <div ref={containerRef} className="relative w-full max-w-md">

        {/* Soul Orb */}
        <div className="soul-orb-wrapper w-full">
          <SoulOrb state={state} />
        </div>

        {/* Flow canvas — sits over everything, pointer-events off */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 10 }}
        />

        {/* Attribute Orbs — inverted arc (outer orbs higher) */}
        <div
          ref={orbRowRef}
          className="relative flex justify-center items-end gap-6 px-4 pb-8"
          style={{ zIndex: 20 }}
        >
          {ARC_ITEMS.map(({ name, label, href, ty }) => (
            <Link
              key={name}
              href={href}
              className="flex flex-col items-center"
              style={{ transform: `translateY(${ty}px)` }}
            >
              <div style={{ width: 72, height: 72 }}>
                <AttributeOrb attribute={name} level01={level01(name)} size="sm" />
              </div>
              <span className="text-[11px] text-slate-400 mt-1">{label}</span>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}
