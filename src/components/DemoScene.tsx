import { PlayerTag } from "@/components/PlayerTag";
import { SnapRotateXROrigin } from "@/components/SnapRotateXROrigin";
import { Sky } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  BvhPhysicsBody,
  FirstPersonCharacterCameraBehavior,
  LocomotionKeyboardInput,
  PointerLockInput,
  PrototypeBox,
  SimpleCharacter,
  useXRControllerInput,
} from "@react-three/viverse";
import { useRef } from "react";
import { Group } from "three";

export const DemoScene = () => {
  const characterRef = useRef<Group>(null);
  const input = useXRControllerInput();

  // Respawn logic - NEW
  useFrame(() => {
    if (characterRef.current == null) {
      return;
    }
    if (characterRef.current.position.y < -10) {
      characterRef.current.position.set(0, 0, 0);
    }
  });
  return (
    <>
      {/* Environment */}
      <Sky />

      {/* Lighting - expanded with shadow settings */}
      <directionalLight intensity={1.2} position={[5, 10, 10]} castShadow />
      <ambientLight intensity={1} />

      <SimpleCharacter
        ref={characterRef}
        model={false}
        cameraBehavior={FirstPersonCharacterCameraBehavior}
        input={[LocomotionKeyboardInput, PointerLockInput, input]}
      >
        <SnapRotateXROrigin />
        <PlayerTag />
      </SimpleCharacter>

      <BvhPhysicsBody>
        <PrototypeBox
          color="#ffffff"
          scale={[10, 0.5, 10]}
          position={[0, -2, 0]}
        />

        {/* Platforms */}
        <PrototypeBox color="#cccccc" scale={[2, 1, 3]} position={[4, 0, 0]} />
        <PrototypeBox
          color="#ffccff"
          scale={[3, 1, 3]}
          position={[3, 1.5, -1]}
        />
        <PrototypeBox
          color="#ccffff"
          scale={[2, 0.5, 3]}
          position={[2, 2.5, -3]}
        />
        <PrototypeBox
          color="#ffccff"
          scale={[2, 1, 3]}
          position={[-3, 0, -2]}
        />
        <PrototypeBox color="#ccffff" scale={[1, 1, 4]} position={[0, -1, 0]} />
        <PrototypeBox
          color="#ffffcc"
          scale={[4, 1, 1]}
          position={[0, 3.5, 0]}
        />
      </BvhPhysicsBody>
    </>
  );
};
