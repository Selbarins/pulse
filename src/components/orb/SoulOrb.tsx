"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function OrbMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <Sphere ref={meshRef} args={[1.4, 64, 64]}>
      <meshStandardMaterial
        color="#E8D5A3"          // soft white-gold
        emissive="#C9A86C"
        emissiveIntensity={0.6}
        roughness={0.25}
        metalness={0.8}
      />
    </Sphere>
  );
}

export default function SoulOrb() {
  return (
    <div className="w-full h-[380px] md:h-[480px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />
        <pointLight position={[-10, -5, -10]} intensity={0.4} color="#C9A86C" />
        <OrbMesh />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />
      </Canvas>
    </div>
  );
}