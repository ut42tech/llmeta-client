"use client";

import { Level } from "@/components/Level";
import { PlayerTag } from "@/components/PlayerTag";
import { SnapRotateXROrigin } from "@/components/SnapRotateXROrigin";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { SimpleCharacter, useXRControllerInput } from "@react-three/viverse";
import { useCallback, useRef } from "react";
import { Group, Vector3 } from "three";

export const MainScene = () => {
  return (
    <>
      <OrbitControls
        autoRotate
        autoRotateSpeed={1}
        enableZoom={true}
        enablePan={true}
        target={[15, 0, -15]}
      />
      <PerspectiveCamera
        makeDefault
        position={[-40, 40 * Math.SQRT2, 40]}
        fov={30}
        onUpdate={(cam) => cam.lookAt(15, 0, -15)}
      />

      <Level />
    </>
  );
};
