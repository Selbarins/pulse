"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const COUNT = 1800;
const RADIUS = 1.45;

export type OrbVisualState = {
  energy: number;      // 0–1
  speed: number;       // rotation multiplier
  stability: number;   // 0–1 (low = flicker / glitch)
  vitality: number;    // 0–1 green life
  wealth: number;      // 0–1 gold richness
  debt?: boolean;
};

const DEFAULT_STATE: OrbVisualState = {
  energy: 0.55,
  speed: 1,
  stability: 0.8,
  vitality: 0.2,
  wealth: 0.3,
  debt: false,
};

function ParticleOrb({ state }: { state: OrbVisualState }) {
  const pointsRef = useRef<THREE.Points>(null);
  const auraRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);
  const auraMatRef = useRef<THREE.PointsMaterial>(null);
  const pulse = useRef(0);

  // Main particle cloud
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);

    // Base palette
    const cCore = new THREE.Color("#F5E6C8");
    const cMid  = new THREE.Color("#E8D5A3");
    const cEdge = new THREE.Color("#C9A86C");

    // Strong accent colors
    const cGold   = new THREE.Color("#FFD700");
    const cGreen  = new THREE.Color("#7CFF9A");
    const cDebt   = new THREE.Color("#4A1C1C");
    const cCold   = new THREE.Color("#6B8CAE");

    for (let i = 0; i < COUNT; i++) {
      const t = i / COUNT;
      const incl = Math.acos(1 - 2 * t);
      const azim = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = RADIUS * (0.68 + Math.random() * 0.32);

      positions[i * 3]     = r * Math.sin(incl) * Math.cos(azim);
      positions[i * 3 + 1] = r * Math.sin(incl) * Math.sin(azim);
      positions[i * 3 + 2] = r * Math.cos(incl);

      const mix = r / RADIUS;
      let c = cCore.clone().lerp(cMid, mix * 0.55).lerp(cEdge, Math.max(0, mix - 0.65) * 1.8);

      // Strong color influence
      if (state.debt) {
        c.lerp(cDebt, 0.55);
        c.lerp(cCold, 0.25);
      } else {
        c.lerp(cGold, state.wealth * 0.55);
        c.lerp(cGreen, state.vitality * 0.45);
      }

      // Energy brightness
      const bright = 0.55 + state.energy * 0.7 + (Math.random() * 0.15);
      colors[i * 3]     = c.r * bright;
      colors[i * 3 + 1] = c.g * bright;
      colors[i * 3 + 2] = c.b * bright;
    }

    return { positions, colors };
  }, [state.energy, state.wealth, state.vitality, state.debt]);

  // Outer aura (larger, softer)
  const { auraPos, auraCol } = useMemo(() => {
    const auraPos = new Float32Array(600 * 3);
    const auraCol = new Float32Array(600 * 3);

    const base = state.debt
      ? new THREE.Color("#3A1212")
      : new THREE.Color().setHSL(0.12 + state.wealth * 0.05, 0.7, 0.55 + state.energy * 0.25);

    if (!state.debt) base.lerp(new THREE.Color("#6EFF9A"), state.vitality * 0.4);

    for (let i = 0; i < 600; i++) {
      const t = i / 600;
      const incl = Math.acos(1 - 2 * t);
      const azim = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = RADIUS * (1.35 + Math.random() * 0.45);

      auraPos[i * 3]     = r * Math.sin(incl) * Math.cos(azim);
      auraPos[i * 3 + 1] = r * Math.sin(incl) * Math.sin(azim);
      auraPos[i * 3 + 2] = r * Math.cos(incl);

      const bright = 0.35 + state.energy * 0.5;
      auraCol[i * 3]     = base.r * bright;
      auraCol[i * 3 + 1] = base.g * bright;
      auraCol[i * 3 + 2] = base.b * bright;
    }

    return { auraPos, auraCol };
  }, [state.energy, state.wealth, state.vitality, state.debt]);

  useFrame((_, delta) => {
    pulse.current += delta * (0.8 + state.energy * 1.4);

    if (pointsRef.current) {
      const s = state.speed;
      pointsRef.current.rotation.y += delta * 0.14 * s;
      pointsRef.current.rotation.x += delta * 0.045 * s;

      // gentle breathing scale
      const breathe = 1 + Math.sin(pulse.current) * (0.015 + state.energy * 0.025);
      pointsRef.current.scale.setScalar(breathe);
    }

    if (auraRef.current) {
      auraRef.current.rotation.y -= delta * 0.06 * state.speed;
      const auraScale = 1 + Math.sin(pulse.current * 0.7) * 0.04;
      auraRef.current.scale.setScalar(auraScale);
    }

    // Opacity / flicker
    if (matRef.current) {
      const baseOp = 0.7 + state.energy * 0.28;
      const flicker = state.stability < 0.55
        ? (Math.random() - 0.5) * (1 - state.stability) * 0.45
        : 0;
      matRef.current.opacity = Math.max(0.25, Math.min(1, baseOp + flicker));
      matRef.current.size = 0.028 + state.energy * 0.022;
    }

    if (auraMatRef.current) {
      auraMatRef.current.opacity = (0.18 + state.energy * 0.35) * (state.debt ? 0.5 : 1);
      auraMatRef.current.size = 0.09 + state.energy * 0.08;
    }
  });

  return (
    <>
      {/* Core points */}
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

      {/* Outer aura */}
      <points ref={auraRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[auraPos, 3]} />
          <bufferAttribute attach="attributes-color" args={[auraCol, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={auraMatRef}
          size={0.12}
          vertexColors
          transparent
          opacity={0.35}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}

interface SoulOrbProps {
  state?: OrbVisualState;
}

export default function SoulOrb({ state = DEFAULT_STATE }: SoulOrbProps) {
  return (
    <div className="w-full h-[380px] md:h-[480px]">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#0B0D10"]} />
        <ambientLight intensity={0.12} />
        <ParticleOrb state={state} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.4 * (state?.speed ?? 1)}
        />
      </Canvas>
    </div>
  );
}
