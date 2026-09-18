"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const COUNT = 1800;
const RADIUS = 1.45;

function ParticleOrb() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);

    // Soft white-gold palette
    const cCore = new THREE.Color("#F5E6C8");
    const cMid = new THREE.Color("#E8D5A3");
    const cEdge = new THREE.Color("#C9A86C");

    for (let i = 0; i < COUNT; i++) {
      // Fibonacci-ish sphere distribution + slight radial scatter
      const t = i / COUNT;
      const incl = Math.acos(1 - 2 * t);
      const azim = Math.PI * (1 + Math.sqrt(5)) * i;

      // Most points on surface, some slightly inward for depth
      const r = RADIUS * (0.72 + Math.random() * 0.28);

      const x = r * Math.sin(incl) * Math.cos(azim);
      const y = r * Math.sin(incl) * Math.sin(azim);
      const z = r * Math.cos(incl);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Brighter near center of distribution, warmer on the rim
      const mix = r / RADIUS;
      const c = cCore.clone().lerp(cMid, mix * 0.6).lerp(cEdge, Math.max(0, mix - 0.7) * 2);
      // small random brightness variance
      const bright = 0.85 + Math.random() * 0.2;
      colors[i * 3] = c.r * bright;
      colors[i * 3 + 1] = c.g * bright;
      colors[i * 3 + 2] = c.b * bright;
    }

    return { positions, colors };
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.12;
    pointsRef.current.rotation.x += delta * 0.04;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
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

export default function SoulOrb() {
  return (
    <div className="w-full h-[380px] md:h-[480px]">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#0B0D10"]} />
        <ambientLight intensity={0.15} />
        <ParticleOrb />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.35}
        />
      </Canvas>
    </div>
  );
}
