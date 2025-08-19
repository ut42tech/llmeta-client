"use client";

import { MainLevel } from "@/components/MainLevel";
import { PlayerTag } from "@/components/PlayerTag";
import { SnapRotateXROrigin } from "@/components/SnapRotateXROrigin";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { SimpleCharacter, useXRControllerInput } from "@react-three/viverse";
import { useCallback, useRef } from "react";
import { Group, Vector3 } from "three";

export const MainScene = () => {
  const characterRef = useRef<Group>(null);
  const input = useXRControllerInput();

  const setPosition = useCallback((v: Vector3) => {
    const ref = characterRef.current;
    if (!ref) return;
    ref.position.copy(v);
  }, []);

  useFrame(() => {
    if (characterRef.current == null) {
      return;
    }
    if (characterRef.current.position.y < -10) {
      setPosition(new Vector3(0, 0, 0));
    }
  });
  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[-10, 10 * Math.SQRT2, 10]}
        fov={45}
        onUpdate={(cam) => cam.lookAt(0, 0, 0)}
      />

      <SimpleCharacter
        input={[input]}
        cameraBehavior={false}
        model={false}
        ref={characterRef}
      >
        <SnapRotateXROrigin />
        <PlayerTag />
      </SimpleCharacter>

      <MainLevel onTeleport={setPosition} />
    </>
  );
};
