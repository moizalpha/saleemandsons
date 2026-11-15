"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Float, OrbitControls, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

export type MaterialKey = "leather" | "canvas" | "suede";
export type ColorwayKey = "cognac" | "espresso" | "olive";

const materialPalette: Record<MaterialKey, Record<ColorwayKey, { body: string; trim: string; roughness: number; metalness: number }>> = {
  leather: {
    cognac: { body: "#774b32", trim: "#2d1b14", roughness: 0.67, metalness: 0.02 },
    espresso: { body: "#3f2b21", trim: "#211711", roughness: 0.67, metalness: 0.02 },
    olive: { body: "#55513a", trim: "#29291f", roughness: 0.69, metalness: 0.01 },
  },
  canvas: {
    cognac: { body: "#b4a17e", trim: "#514536", roughness: 0.94, metalness: 0 },
    espresso: { body: "#777063", trim: "#3b342c", roughness: 0.96, metalness: 0 },
    olive: { body: "#77745a", trim: "#3f4032", roughness: 0.96, metalness: 0 },
  },
  suede: {
    cognac: { body: "#8a684c", trim: "#493326", roughness: 0.96, metalness: 0 },
    espresso: { body: "#65564a", trim: "#2b241f", roughness: 0.97, metalness: 0 },
    olive: { body: "#655f49", trim: "#302f24", roughness: 0.97, metalness: 0 },
  },
};

function Carryall({ material, colorway }: { material: MaterialKey; colorway: ColorwayKey }) {
  const palette = materialPalette[material][colorway];
  const handleCurve = useMemo(
    () => new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.47, 0.72, 0.02),
      new THREE.Vector3(-0.48, 1.12, 0.02),
      new THREE.Vector3(-0.28, 1.35, 0.02),
      new THREE.Vector3(0.28, 1.35, 0.02),
      new THREE.Vector3(0.48, 1.12, 0.02),
      new THREE.Vector3(0.47, 0.72, 0.02),
    ]),
    [],
  );

  return (
    <group rotation={[0.02, -0.32, 0.02]}>
      {/* Main structured leather body */}
      <RoundedBox args={[2.35, 1.48, 0.66]} radius={0.12} smoothness={5} castShadow receiveShadow>
        <meshStandardMaterial color={palette.body} roughness={palette.roughness} metalness={palette.metalness} />
      </RoundedBox>
      {/* Side gussets */}
      <RoundedBox args={[0.16, 1.08, 0.74]} radius={0.055} position={[-1.16, -0.02, 0]} castShadow>
        <meshStandardMaterial color={palette.trim} roughness={0.86} />
      </RoundedBox>
      <RoundedBox args={[0.16, 1.08, 0.74]} radius={0.055} position={[1.16, -0.02, 0]} castShadow>
        <meshStandardMaterial color={palette.trim} roughness={0.86} />
      </RoundedBox>
      {/* Front pocket */}
      <RoundedBox args={[1.64, 0.48, 0.085]} radius={0.055} position={[0, -0.43, 0.36]} castShadow>
        <meshStandardMaterial color={palette.trim} roughness={0.78} />
      </RoundedBox>
      {/* Horizontal leather strap */}
      <RoundedBox args={[2.28, 0.12, 0.075]} radius={0.035} position={[0, 0.03, 0.39]} castShadow>
        <meshStandardMaterial color={palette.trim} roughness={0.72} />
      </RoundedBox>
      {/* Brass buckle and keeper */}
      <RoundedBox args={[0.34, 0.34, 0.09]} radius={0.045} position={[0, 0.02, 0.45]}>
        <meshStandardMaterial color="#a7803b" metalness={0.78} roughness={0.3} />
      </RoundedBox>
      <RoundedBox args={[0.16, 0.19, 0.09]} radius={0.025} position={[0, 0.02, 0.51]}>
        <meshStandardMaterial color="#2d2118" metalness={0.1} roughness={0.7} />
      </RoundedBox>
      {/* Handle */}
      <mesh castShadow>
        <tubeGeometry args={[handleCurve, 64, 0.065, 14, false]} />
        <meshStandardMaterial color={palette.trim} roughness={0.73} />
      </mesh>
      {/* Handle anchors */}
      {[-0.48, 0.48].map((x) => (
        <RoundedBox key={x} args={[0.17, 0.23, 0.13]} radius={0.035} position={[x, 0.72, 0.06]}>
          <meshStandardMaterial color="#98733b" metalness={0.72} roughness={0.35} />
        </RoundedBox>
      ))}
      {/* Restrained brass maker's mark */}
      <mesh position={[0, -0.16, 0.406]}>
        <boxGeometry args={[0.28, 0.018, 0.012]} />
        <meshStandardMaterial color="#bd9857" metalness={0.7} roughness={0.4} />
      </mesh>
    </group>
  );
}

export default function HeroScene({ material = "leather", colorway = "cognac", compact = false }: { material?: MaterialKey; colorway?: ColorwayKey; compact?: boolean }) {
  return (
    <div className={`hero-scene ${compact ? "hero-scene--compact" : ""}`} aria-label="Interactive three-dimensional view of the Heritage Carryall">
      <Canvas
        shadows
        dpr={[1, 1.55]}
        camera={{ position: [3.55, 2.05, 4.5], fov: 34 }}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.9} />
          <directionalLight position={[4, 5, 4]} intensity={2.1} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
          <directionalLight position={[-4, 1, -3]} intensity={0.7} color="#c7a16b" />
          <spotLight position={[0, 5, 1]} intensity={1.35} angle={0.48} penumbra={0.7} castShadow />
          <Float speed={1.05} rotationIntensity={0.055} floatIntensity={0.11}>
            <Carryall material={material} colorway={colorway} />
          </Float>
          <ContactShadows position={[0, -1.12, 0]} opacity={0.42} scale={5.8} blur={3.1} far={4} />
          <OrbitControls
            makeDefault
            enablePan={false}
            enableZoom={false}
            autoRotate={false}
            minPolarAngle={0.85}
            maxPolarAngle={2.2}
            rotateSpeed={0.68}
          />
        </Suspense>
      </Canvas>
      <div className="scene-grain" aria-hidden="true" />
    </div>
  );
}
