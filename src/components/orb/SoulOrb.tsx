"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const COUNT = 2800;          // denser than original
const RADIUS = 1.45;

export type OrbVisualState = {
  energy: number;       // 0–1  → brightness + size
  speed: number;        // rotation multiplier
  stability: number;    // 0–1  → flicker amount
  vitality: number;     // 0–1  → % of green lights
  wealth: number;       // 0–1  → % of gold lights
  debt?: boolean;
};

const DEFAULT_STATE: OrbVisualState = {
  energy: 0.55,
  speed: 1,
  stability: 0.85,
  vitality: 0.2,
  wealth: 0.3,
  debt: false,
};

function ParticleOrb({ state }: { state: OrbVisualState }) {
  const pointsRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);
  const auraRef = useRef<THREE.Mesh>(null);
  const pulse = useRef(0);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);

    // Original soft white-gold
    const cCore = new THREE.Color("#F5E6C8");
    const cMid  = new THREE.Color("#E8D5A3");
    const cEdge = new THREE.Color("#C9A86C");

    // Strong accent colors
    const cGold  = new THREE.Color("#FFD56A");
    const cGreen = new THREE.Color("#7CFFB2");
    const cDebt  = new THREE.Color("#5C1A1A");
    const cCold  = new THREE.Color("#6B8CAE");

    for (let i = 0; i < COUNT; i++) {
      const t = i / COUNT;
      const incl = Math.acos(1 - 2 * t);
      const azim = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = RADIUS * (0.70 + Math.random() * 0.30);

      positions[i * 3]     = r * Math.sin(incl) * Math.cos(azim);
      positions[i * 3 + 1] = r * Math.sin(incl) * Math.sin(azim);
      positions[i * 3 + 2] = r * Math.cos(incl);

      // Base color (original logic)
      const mix = r / RADIUS;
      let c = cCore.clone()
        .lerp(cMid, mix * 0.6)
        .lerp(cEdge, Math.max(0, mix - 0.7) * 2);

      // === COLOR CUSTOMIZATION BY STATS ===
      // A percentage of particles get strongly recolored
      const rand = Math.random();

      if (state.debt) {
        if (rand < 0.55) c.lerp(cDebt, 0.75);
        else c.lerp(cCold, 0.4);
      } else {
        // Wealth → gold lights
        if (rand < state.wealth * 0.55) {
          c.lerp(cGold, 0.7 + state.wealth * 0.3);
        }
        // Vitality → green lights
        else if (rand < state.wealth * 0.55 + state.vitality * 0.5) {
          c.lerp(cGreen, 0.65 + state.vitality * 0.35);
        }
      }

      // Brightness driven by energy
      const bright = 0.65 + state.energy * 0.55 + Math.random() * 0.12;
      colors[i * 3]     = c.r * bright;
      colors[i * 3 + 1] = c.g * bright;
      colors[i * 3 + 2] = c.b * bright;
    }

    return { positions, colors };
  }, [state.energy, state.wealth, state.vitality, state.debt]);

  useFrame((_, delta) => {
    pulse.current += delta * (0.9 + state.energy * 1.6);

    if (pointsRef.current) {
      // Stronger speed range
      const s = state.speed;
      pointsRef.current.rotation.y += delta * 0.16 * s;
      pointsRef.current.rotation.x += delta * 0.05 * s;

      // Subtle breathing
      const breathe = 1 + Math.sin(pulse.current) * (0.012 + state.energy * 0.02);
      pointsRef.current.scale.setScalar(breathe);
    }

    // Soft aura glow (mesh, not points)
    if (auraRef.current) {
      const mat = auraRef.current.material as THREE.MeshBasicMaterial;
      const baseOp = 0.07 + state.energy * 0.13;
      mat.opacity = state.debt ? baseOp * 0.4 : baseOp;

      // Aura color follows dominant stats
      if (state.debt) {
        mat.color.set("#3A1010");
      } else {
        const aura = new THREE.Color("#F5E6C8");
        aura.lerp(new THREE.Color("#FFD56A"), state.wealth * 0.6);
        aura.lerp(new THREE.Color("#7CFFB2"), state.vitality * 0.5);
        mat.color.copy(aura);
      }

      auraRef.current.scale.setScalar(1.55 + Math.sin(pulse.current * 0.6) * 0.04);
    }

    // Flicker & size
    if (matRef.current) {
      const baseOp = 0.78 + state.energy * 0.2;
      const flicker =
        state.stability < 0.6
          ? (Math.random() - 0.5) * (1 - state.stability) * 0.5
          : 0;
      matRef.current.opacity = Math.max(0.3, Math.min(1, baseOp + flicker));
      matRef.current.size = 0.026 + state.energy * 0.018;
    }
  });

  return (
    <>
      {/* Main lighted points – original form, just denser */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={matRef}
          size={0.032}
          vertexColors
          transparent
          opacity={0.95}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Soft colored aura (clean mesh glow) */}
      <mesh ref={auraRef}>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshBasicMaterial
          transparent
          opacity={0.1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color="#F5E6C8"
        />
      </mesh>
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
        camera={{ position: [0, 0, 4.4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#0B0D10"]} />
        <ambientLight intensity={0.1} />
        <ParticleOrb state={state} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.35 * (state?.speed ?? 1)}
        />
      </Canvas>
    </div>
  );
}
