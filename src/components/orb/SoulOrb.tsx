"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/* -------------------------------------------------------------------------- */
/*  Config                                                                    */
/* -------------------------------------------------------------------------- */

const CORE_COUNT = 3200; // particles in the orb itself
const AURA_COUNT = 1100; // haze + fireflies + glints + ash around the orb
const RADIUS = 1.45;
const CAMERA_Z = 6; // pulled back so the aura has room and never gets cropped
const FOV = 45;

/* -------------------------------------------------------------------------- */
/*  Public types                                                              */
/* -------------------------------------------------------------------------- */

export type OrbVisualState = {
  energy: number; // 0–1  → brightness, size, aura radius, heartbeat speed
  speed: number; // rotation multiplier (also swirl speed of the aura)
  stability: number; // 0–1  → flicker + glitch bursts (below ~0.85 it starts)
  vitality: number; // 0–1  → amount of vivid green lights + rising fireflies
  wealth: number; // 0–1  → amount of gold lights + orbiting glints
  debt?: boolean; // dark, sagging, ash falling
};

const DEFAULT_STATE: OrbVisualState = {
  energy: 0.55,
  speed: 1,
  stability: 0.85,
  vitality: 0.2,
  wealth: 0.3,
  debt: false,
};

/** Handy for testing every look, e.g. <SoulOrb state={ORB_PRESETS.radiant} /> */
export const ORB_PRESETS: Record<string, OrbVisualState> = {
  dormant: { energy: 0.12, speed: 0.4, stability: 0.9, vitality: 0.05, wealth: 0.05 },
  calm: DEFAULT_STATE,
  thriving: { energy: 0.7, speed: 1.2, stability: 0.9, vitality: 0.85, wealth: 0.1 },
  prosperous: { energy: 0.7, speed: 1.1, stability: 0.9, vitality: 0.1, wealth: 0.9 },
  radiant: { energy: 1, speed: 1.6, stability: 0.95, vitality: 0.8, wealth: 0.8 },
  unstable: { energy: 0.6, speed: 1.3, stability: 0.15, vitality: 0.4, wealth: 0.4 },
  indebted: { energy: 0.35, speed: 0.6, stability: 0.5, vitality: 0.3, wealth: 0.3, debt: true },
};

export function getOrbMood(s: OrbVisualState): string {
  if (s.debt) return "Indebted";
  if (s.stability < 0.4) return "Unstable";
  if (s.vitality > 0.6 && s.wealth > 0.6 && s.energy > 0.6) return "Radiant";
  if (s.vitality > 0.6) return "Thriving";
  if (s.wealth > 0.6) return "Prosperous";
  if (s.energy < 0.25) return "Dormant";
  return "Calm";
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

type RGB = [number, number, number];

const hexToRgb = (hex: string): RGB => {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

const lerp3 = (a: RGB, b: RGB, t: number): RGB => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

type Uniforms = Record<string, THREE.IUniform>;

const makeSharedUniforms = (): Uniforms => ({
  uTime: { value: 0 },
  uSpin: { value: 0 },
  uEnergy: { value: 0.5 },
  uStability: { value: 1 },
  uVitality: { value: 0 },
  uWealth: { value: 0 },
  uDebt: { value: 0 },
  uGlitch: { value: 0 },
  uScale: { value: 1000 },
});

/* -------------------------------------------------------------------------- */
/*  Shaders                                                                   */
/*  (colors are written directly in sRGB so they look the same on any three   */
/*  version – no color-space surprises)                                       */
/* -------------------------------------------------------------------------- */

const GLSL_COMMON = /* glsl */ `
  const vec3 IVORY = vec3(0.96, 0.90, 0.78);
  const vec3 GOLD  = vec3(1.00, 0.78, 0.24);
  const vec3 GREEN = vec3(0.22, 1.00, 0.58);
  const vec3 DEBT  = vec3(0.55, 0.10, 0.09);
  const vec3 EMBER = vec3(1.00, 0.22, 0.12);
  const vec3 COLD  = vec3(0.42, 0.55, 0.68);
  const float PI = 3.14159265;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  vec3 rotY(vec3 p, float a) {
    float c = cos(a), s = sin(a);
    return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
  }
`;

const CORE_VERT = /* glsl */ `
  uniform float uTime, uEnergy, uStability, uVitality, uWealth, uDebt, uGlitch, uScale, uSize;
  attribute vec3 aColor;
  attribute vec4 aRand;   // x: role, y: speed/size, z: phase, w: hash
  varying vec3 vColor;
  varying float vAlpha;
  ${GLSL_COMMON}

  void main() {
    vec3 pos = position;
    vec3 dir = normalize(pos);

    // instability 0 (stable) → 1 (chaos). Starts below stability ≈ 0.85
    float fl = smoothstep(0.15, 0.9, 1.0 - uStability);

    // ---- which particles become vivid gold / green -------------------------
    float goldShare  = uWealth   * 0.55 * (1.0 - uDebt);
    float greenShare = uVitality * 0.55 * (1.0 - uDebt);
    float isGold  = step(aRand.x, goldShare);
    float isGreen = step(goldShare, aRand.x) * step(aRand.x, goldShare + greenShare);

    vec3 col = aColor;
    float size = uSize * (0.65 + aRand.y * 0.9) * (0.8 + uEnergy * 0.5);
    float bright = 0.75 + uEnergy * 0.55;

    // heartbeat
    float heart = 0.5 + 0.5 * sin(uTime * (1.0 + uEnergy * 2.2));
    bright *= 0.9 + heart * 0.25 * uEnergy;

    if (isGold > 0.5) {
      // sparkling gold: quick glints
      float sp = pow(max(0.0, sin(uTime * (1.6 + aRand.y * 3.5) + aRand.z * 40.0)), 5.0);
      col = GOLD;
      bright = (1.25 + sp * 1.6 + uWealth * 0.4) * (0.8 + uEnergy * 0.4);
      size *= 1.5 + sp * 1.8;
    } else if (isGreen > 0.5) {
      // vivid green: a wave of life travelling up through the orb
      float wave = 0.5 + 0.5 * sin(uTime * (1.8 + uEnergy) - pos.y * 3.2 + aRand.z * 1.2);
      col = GREEN;
      bright = (1.2 + wave * 1.4 + uVitality * 0.5) * (0.8 + uEnergy * 0.4);
      size *= 1.7 + wave * 1.4;
      pos += dir * wave * 0.05 * uVitality;
    }

    // ---- debt: cold, dark red, sagging, a few warning embers ---------------
    float debtRole = step(aRand.w, 0.55);
    col = mix(col, COLD, uDebt * 0.35);
    col = mix(col, DEBT, uDebt * 0.85 * debtRole);
    float spark = step(0.975, aRand.y) * uDebt;
    col = mix(col, EMBER, spark);
    bright = mix(bright, 1.6 * (0.6 + 0.4 * sin(uTime * 1.5 + aRand.z * 20.0)), spark);
    bright *= 1.0 - uDebt * 0.35;
    pos.y -= uDebt * 0.12 * (0.3 + aRand.y);
    pos *= 1.0 - uDebt * 0.06;

    // ---- instability: strong per-particle dropout + jitter + global glitch --
    float tick = floor(uTime * (6.0 + aRand.y * 14.0));
    float gate = hash(vec2(aRand.w * 91.7 + aRand.z * 13.1, tick));
    float dropped = step(gate, fl * 0.7);

    float alpha = 0.55 + uEnergy * 0.35;
    alpha *= mix(1.0, 0.05 + gate * 0.3, dropped);
    alpha *= 1.0 - fl * 0.35 * (0.5 + 0.5 * sin(uTime * 23.0 + aRand.z * 30.0));
    alpha *= 1.0 - uGlitch * 0.85;
    alpha *= 1.0 - uDebt * 0.3;

    vec3 jit = vec3(
      hash(vec2(aRand.w, tick + 1.0)),
      hash(vec2(aRand.w, tick + 2.0)),
      hash(vec2(aRand.w, tick + 3.0))
    ) - 0.5;
    pos += jit * (fl * 0.05 + uGlitch * 0.18);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = size * uScale / -mv.z;

    // slight depth fade so the back of the orb feels farther away
    float depth = clamp((-mv.z - ${(CAMERA_Z - RADIUS).toFixed(2)}) / 3.0, 0.0, 1.0);
    vColor = col * bright;
    vAlpha = alpha * mix(1.0, 0.5, depth);
  }
`;

const CORE_FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float core = clamp(1.0 - d, 0.0, 1.0);
    float a = pow(core, 2.0) + pow(core, 6.0) * 0.8;
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;

const AURA_VERT = /* glsl */ `
  uniform float uTime, uSpin, uEnergy, uStability, uVitality, uWealth, uDebt, uGlitch, uScale;
  attribute vec4 aRand;   // x: role, y: radius/size, z: speed, w: phase
  varying vec3 vColor;
  varying float vAlpha;
  varying float vFalloff;
  varying float vHot;
  ${GLSL_COMMON}

  void main() {
    float r1 = aRand.x, r2 = aRand.y, r3 = aRand.z, r4 = aRand.w;
    float fl = smoothstep(0.15, 0.9, 1.0 - uStability);

    // ---- who plays which role in the aura ----------------------------------
    float goldShare  = uWealth   * 0.30 * (1.0 - uDebt);
    float greenShare = uVitality * 0.34 * (1.0 - uDebt);
    float ashShare   = uDebt * 0.45;
    float isGold  = step(r1, goldShare);
    float isGreen = step(goldShare, r1) * step(r1, goldShare + greenShare);
    float isAsh   = step(1.0 - ashShare, r1) * (1.0 - isGold) * (1.0 - isGreen);

    // ---- haze (default role): slow swirling cloud, energy expands it --------
    float breath = 1.0 + sin(uTime * (0.7 + uEnergy * 1.3)) * (0.02 + uEnergy * 0.04);
    float expand = (0.88 + uEnergy * 0.24) * (1.0 - uDebt * 0.12) * breath;

    vec3 p = rotY(position, uSpin * (0.08 + r3 * 0.16) + uTime * 0.015);
    p.y += sin(uTime * 0.35 + r4 * 6.2831) * 0.07;
    p *= expand;

    // haze tint follows the dominant stat(s)
    vec3 tint = (GOLD * uWealth + GREEN * uVitality) / max(uWealth + uVitality, 0.001);
    vec3 col = mix(IVORY, tint, clamp(max(uWealth, uVitality) * 0.8, 0.0, 0.8));
    col = mix(col, DEBT, uDebt * 0.8);

    float size = 0.30 + r2 * 0.35;
    float alpha = (0.03 + uEnergy * 0.05) * (0.8 + 0.2 * sin(uTime * (0.6 + uEnergy) + r3 * 6.2831));
    alpha *= 1.0 - uDebt * 0.4;
    float falloff = 1.4;
    float hot = 0.0;

    if (isGreen > 0.5) {
      // fireflies: spiral upward, fade in/out
      float life = fract(uTime * (0.06 + uEnergy * 0.09) * (0.6 + r3) + r4);
      vec2 d = normalize(position.xz + vec2(1e-4));
      vec3 g = vec3(d.x, 0.0, d.y) * (1.25 + r2 * 0.7);
      g.y = mix(-1.3, 1.5, life);
      g = rotY(g, life * 2.2 + uSpin * 0.2);
      g.x += sin(uTime * 1.1 + r4 * 6.2831) * 0.08;
      p = g;
      float twinkle = 0.6 + 0.4 * sin(uTime * 5.0 + r3 * 30.0);
      col = GREEN * (1.3 + uVitality);
      size = 0.09 + r2 * 0.08;
      alpha = sin(life * PI) * twinkle * (0.45 + uVitality * 0.55);
      falloff = 2.4;
      hot = 0.9;
    } else if (isGold > 0.5) {
      // gold glints orbiting the orb
      float ga = uSpin * (0.45 + r3 * 0.8) + r4 * 6.2831;
      p = rotY(normalize(position) * (1.5 + r2 * 0.6), ga) * (0.92 + uEnergy * 0.16);
      float glint = pow(max(0.0, sin(uTime * (1.5 + r3 * 3.5) + r4 * 40.0)), 5.0);
      col = GOLD * (1.2 + glint * 1.5);
      size = 0.06 + glint * 0.16;
      alpha = (0.15 + glint * 0.85) * (0.4 + uWealth * 0.6);
      falloff = 2.6;
      hot = 1.0;
    } else if (isAsh > 0.5) {
      // debt: dark embers / ash slowly falling
      float life = fract(uTime * 0.045 * (0.6 + r3) + r4);
      vec3 a = normalize(position) * (1.3 + r2 * 0.8);
      a.y = a.y * 0.4 + 1.0 - life * 2.5;
      a.x += sin(uTime * 0.7 + r4 * 6.2831) * 0.06;
      p = a;
      col = mix(EMBER * 0.7, DEBT, r2);
      size = 0.07 + r2 * 0.09;
      alpha = sin(life * PI) * 0.6;
      falloff = 2.2;
      hot = 0.4;
    }

    // ---- instability makes the whole aura stutter --------------------------
    float tick = floor(uTime * (5.0 + r2 * 12.0));
    float gate = hash(vec2(r4 * 91.7 + r3 * 13.1, tick));
    alpha *= mix(1.0, 0.05, step(gate, fl * 0.65));
    alpha *= 1.0 - uGlitch * 0.8;
    alpha *= 1.0 - fl * 0.4 * (0.5 + 0.5 * sin(uTime * 17.0 + r3 * 20.0));
    vec3 jit = vec3(
      hash(vec2(r4, tick + 1.0)),
      hash(vec2(r4, tick + 2.0)),
      hash(vec2(r4, tick + 3.0))
    ) - 0.5;
    p += jit * (fl * 0.04 + uGlitch * 0.15);

    // soft outer edge so nothing is ever cut by the canvas
    alpha *= 1.0 - smoothstep(1.8, 2.4, length(p));

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = size * uScale / -mv.z;

    vColor = col;
    vAlpha = alpha;
    vFalloff = falloff;
    vHot = hot;
  }
`;

const AURA_FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vFalloff;
  varying float vHot;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float core = clamp(1.0 - d, 0.0, 1.0);
    float a = pow(core, vFalloff) + pow(core, 6.0) * vHot;
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;

/* -------------------------------------------------------------------------- */
/*  Geometry                                                                  */
/* -------------------------------------------------------------------------- */

function buildCore() {
  const positions = new Float32Array(CORE_COUNT * 3);
  const colors = new Float32Array(CORE_COUNT * 3);
  const rand = new Float32Array(CORE_COUNT * 4);

  const cCore = hexToRgb("#F5E6C8");
  const cMid = hexToRgb("#E8D5A3");
  const cEdge = hexToRgb("#C9A86C");

  for (let i = 0; i < CORE_COUNT; i++) {
    const t = i / CORE_COUNT;
    const incl = Math.acos(1 - 2 * t);
    const azim = Math.PI * (1 + Math.sqrt(5)) * i;
    const r = RADIUS * (0.7 + Math.random() * 0.3);

    positions[i * 3] = r * Math.sin(incl) * Math.cos(azim);
    positions[i * 3 + 1] = r * Math.sin(incl) * Math.sin(azim);
    positions[i * 3 + 2] = r * Math.cos(incl);

    // original soft white-gold base
    const mix = r / RADIUS;
    let c = lerp3(cCore, cMid, mix * 0.6);
    c = lerp3(c, cEdge, Math.max(0, mix - 0.7) * 2);
    colors.set(c, i * 3);

    for (let k = 0; k < 4; k++) rand[i * 4 + k] = Math.random();
  }
  return { positions, colors, rand };
}

function buildAura() {
  const positions = new Float32Array(AURA_COUNT * 3);
  const rand = new Float32Array(AURA_COUNT * 4);

  for (let i = 0; i < AURA_COUNT; i++) {
    // uniform direction on a sphere, radius in a shell around the orb
    const z = Math.random() * 2 - 1;
    const phi = Math.random() * Math.PI * 2;
    const s = Math.sqrt(1 - z * z);
    const r = 1.5 + Math.random() * 0.6;
    positions[i * 3] = r * s * Math.cos(phi);
    positions[i * 3 + 1] = r * z;
    positions[i * 3 + 2] = r * s * Math.sin(phi);
    for (let k = 0; k < 4; k++) rand[i * 4 + k] = Math.random();
  }
  return { positions, rand };
}

/* -------------------------------------------------------------------------- */
/*  Layers                                                                    */
/* -------------------------------------------------------------------------- */

function CorePoints({ uniforms }: { uniforms: Uniforms }) {
  const { positions, colors, rand } = useMemo(buildCore, []);
  const layerUniforms = useMemo(
    () => ({ ...uniforms, uSize: { value: 0.062 } }),
    [uniforms]
  );

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
        <bufferAttribute attach="attributes-aRand" args={[rand, 4]} />
      </bufferGeometry>
      <shaderMaterial
        uniforms={layerUniforms}
        vertexShader={CORE_VERT}
        fragmentShader={CORE_FRAG}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function AuraPoints({ uniforms }: { uniforms: Uniforms }) {
  const { positions, rand } = useMemo(buildAura, []);

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aRand" args={[rand, 4]} />
      </bufferGeometry>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={AURA_VERT}
        fragmentShader={AURA_FRAG}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* -------------------------------------------------------------------------- */
/*  Scene                                                                     */
/* -------------------------------------------------------------------------- */

function OrbScene({ state }: { state: OrbVisualState }) {
  const orbRef = useRef<THREE.Group>(null);
  const uniforms = useMemo(makeSharedUniforms, []);
  const pulse = useRef(0);
  const glitch = useRef(0);

  // smoothed values – buttons glide between looks instead of popping
  const cur = useRef({
    energy: state.energy,
    speed: state.speed,
    stability: state.stability,
    vitality: state.vitality,
    wealth: state.wealth,
    debt: state.debt ? 1 : 0,
  });

  useFrame((rs, delta) => {
    const dt = Math.min(delta, 0.05);
    const c = cur.current;
    const damp = THREE.MathUtils.damp;

    c.energy = damp(c.energy, clamp01(state.energy), 2.5, dt);
    c.speed = damp(c.speed, state.speed, 2.5, dt);
    c.stability = damp(c.stability, clamp01(state.stability), 3, dt);
    c.vitality = damp(c.vitality, clamp01(state.vitality), 2.5, dt);
    c.wealth = damp(c.wealth, clamp01(state.wealth), 2.5, dt);
    c.debt = damp(c.debt, state.debt ? 1 : 0, 2, dt);

    // random glitch bursts – the less stable, the more (and harder) they hit
    const instab = 1 - c.stability;
    if (Math.random() < instab * instab * 0.08 * dt * 60) {
      glitch.current = 0.5 + Math.random() * 0.5;
    }
    glitch.current = Math.max(0, glitch.current - dt * 5);

    const u = uniforms;
    u.uTime.value += dt;
    u.uSpin.value += dt * c.speed;
    u.uEnergy.value = c.energy;
    u.uStability.value = c.stability;
    u.uVitality.value = c.vitality;
    u.uWealth.value = c.wealth;
    u.uDebt.value = c.debt;
    u.uGlitch.value = glitch.current;
    u.uScale.value =
      (rs.size.height * rs.gl.getPixelRatio()) /
      (2 * Math.tan(THREE.MathUtils.degToRad(FOV) / 2));

    // orb rotation + breathing
    pulse.current += dt * (0.9 + c.energy * 1.6);
    const g = orbRef.current;
    if (g) {
      g.rotation.y += dt * 0.16 * c.speed;
      g.rotation.x += dt * 0.05 * c.speed;

      const base = 0.94 + c.energy * 0.08 - c.debt * 0.05;
      const breathe = 1 + Math.sin(pulse.current) * (0.012 + c.energy * 0.02);
      g.scale.setScalar(base * breathe);

      const shake = glitch.current * 0.03;
      g.position.set((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake, 0);
    }
  });

  return (
    <>
      <group ref={orbRef}>
        <CorePoints uniforms={uniforms} />
      </group>
      <AuraPoints uniforms={uniforms} />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

interface SoulOrbProps {
  state?: OrbVisualState;
  /** Small caption under the orb showing the current mood – handy while tuning */
  showMood?: boolean;
}

export default function SoulOrb({ state = DEFAULT_STATE, showMood = false }: SoulOrbProps) {
  return (
    <div className="relative w-full h-[380px] md:h-[480px]">
      <Canvas
        camera={{ position: [0, 0, CAMERA_Z], fov: FOV }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#0B0D10"]} />
        <OrbScene state={state} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.35 * (state?.speed ?? 1)}
        />
      </Canvas>

      {showMood && (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-xs text-white/50">
          {getOrbMood(state)}
        </div>
      )}
    </div>
  );
}
