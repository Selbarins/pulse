"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const COUNT = 1800;
const RADIUS = 1.45;

export type OrbVisualState = {
  /** 0–1 overall energy (brightness + density feel) */
  energy: number;
  /** rotation speed multiplier (1 = current baseline) */
  speed: number;
  /** 0–1 surface stability (lower = more flicker / weaker) */
  stability: number;
  /** optional life tint 0–1 (Vitality) */
  vitality: number;
  /** optional gold richness 0–1 (Wealth) */
  wealth: number;
};

const DEFAULT_STATE: OrbVisualState = {
  energy: 0.55,
  speed: 1,
  stability: 0.8,
  vitality: 0.2,
  wealth: 0.3,
};

function ParticleOrb({ state }: { state: OrbVisualState }) {
  const pointsRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);

    const cCore = new THREE.Color("#F5E6C8");
    const cMid = new THREE.Color("#E8D5A3");
    const cEdge = new THREE.Color("#C9A86C");
    // slight green life bleed when vitality is high
    const cVital = new THREE.Color("#A8D5A3");

    for (let i = 0; i < COUNT; i++) {
      const t = i / COUNT;
      const incl = Math.acos(1 - 2 * t);
      const azim = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = RADIUS * (0.72 + Math.random() * 0.28);

      positions[i * 3] = r * Math.sin(incl) * Math.cos(azim);
      positions[i * 3 + 1] = r * Math.sin(incl) * Math.sin(azim);
      positions[i * 3 + 2] = r * Math.cos(incl);

      const mix = r / RADIUS;
      let c = cCore.clone().lerp(cMid, mix * 0.6).lerp(cEdge, Math.max(0, mix - 0.7) * 2);
      // wealth → warmer gold, vitality → soft green life energy
      c.lerp(cEdge, state.wealth * 0.35);
      c.lerp(cVital, state.vitality * 0.25);

      const bright = (0.7 + state.energy * 0.4) * (0.85 + Math.random() * 0.2);
      colors[i * 3] = c.r * bright;
      colors[i * 3 + 1] = c.g * bright;
      colors[i * 3 + 2] = c.b * bright;
    }

    return { positions, colors };
  }, [state.energy, state.wealth, state.vitality]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const s = state.speed;
    pointsRef.current.rotation.y += delta * 0.12 * s;
    pointsRef.current.rotation.x += delta * 0.04 * s;

    // subtle stability flicker
    if (matRef.current) {
      const base = 0.75 + state.energy * 0.25;
      const flicker = state.stability < 0.6 ? (Math.random() - 0.5) * (1 - state.stability) * 0.15 : 0;
      matRef.current.opacity = Math.max(0.4, Math.min(1, base + flicker));
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.035}
        vertexColors
        transparent
        opacity={0.95}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

interface SoulOrbProps {
  state?: OrbVisualState;
}

export default function SoulOrb({ state = DEFAULT_STATE }: SoulOrbProps) {
  return (
    <div className="w-full h-[380px] md:h-[480px]">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#0B0D10"]} />
        <ambientLight intensity={0.15} />
        <ParticleOrb state={state} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.35 * state.speed}
        />
      </Canvas>
    </div>
  );
}
