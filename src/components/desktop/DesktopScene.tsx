"use client";

import { Level } from "@/components/Level";
import { PlayerTag } from "@/components/PlayerTag";
import { useFrame } from "@react-three/fiber";
import { SimpleCharacter } from "@react-three/viverse";
import { useCallback, useRef } from "react";
import { Group, Vector3 } from "three";

export const DesktopScene = () => {
  const characterRef = useRef<Group>(null);

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
      <SimpleCharacter ref={characterRef}>
        <PlayerTag />
      </SimpleCharacter>

      <Level />
    </>
  );
};
