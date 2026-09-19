"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const COUNT = 1100;          // denser
const RADIUS = 1.05;         // tighter sphere

// More vivid / saturated colors
const ATTR_COLORS: Record<string, string> = {
  wealth: "#F5C542",       // richer gold
  vitality: "#FF4D9E",     // vivid pink
  focus: "#3B9EFF",        // stronger blue
  momentum: "#22E39A",     // brighter green
  discipline: "#FF5C5C",   // stronger red
};

interface AttributeOrbProps {
  attribute: "wealth" | "vitality" | "focus" | "momentum" | "discipline";
  level01: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function ParticleAttribute({ color, level01 }: { color: string; level01: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colorsArr = new Float32Array(COUNT * 3);
    const c = new THREE.Color(color);

    for (let i = 0; i < COUNT; i++) {
      const t = i / COUNT;
      const incl = Math.acos(1 - 2 * t);
      const azim = Math.PI * (1 + Math.sqrt(5)) * i;

      // Much tighter distribution (more disciplined)
      const r = RADIUS * (0.82 + Math.random() * 0.18);

      positions[i * 3]     = r * Math.sin(incl) * Math.cos(azim);
      positions[i * 3 + 1] = r * Math.sin(incl) * Math.sin(azim);
      positions[i * 3 + 2] = r * Math.cos(incl);

      // Stronger, more vivid brightness
      const bright = 0.95 + level01 * 0.4 + Math.random() * 0.12;
      colorsArr[i * 3]     = Math.min(1, c.r * bright);
      colorsArr[i * 3 + 1] = Math.min(1, c.g * bright);
      colorsArr[i * 3 + 2] = Math.min(1, c.b * bright);
    }
    return { positions, colors: colorsArr };
  }, [color, level01]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const speed = 0.12 + level01 * 0.28;
    pointsRef.current.rotation.y += delta * speed;
    pointsRef.current.rotation.x += delta * speed * 0.25;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.052}
        vertexColors
        transparent
        opacity={0.92}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function AttributeOrb({
  attribute,
  level01,
  size = "sm",
  className = "",
}: AttributeOrbProps) {
  const height = size === "lg" ? 220 : size === "md" ? 140 : 88;

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <Canvas
        camera={{ position: [0, 0, 2.9], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.35} />
        <ParticleAttribute color={ATTR_COLORS[attribute]} level01={level01} />
      </Canvas>
    </div>
  );
}
