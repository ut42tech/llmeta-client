import { Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  BvhPhysicsBody,
  PrototypeBox,
  SimpleCharacter,
  Viverse,
} from "@react-three/viverse";

export const DemoScene = () => {
  return (
    <Canvas shadows>
      <Viverse>
        <Sky />
        <directionalLight intensity={1.2} position={[5, 10, 10]} castShadow />
        <ambientLight intensity={1} />
        <SimpleCharacter />
        <BvhPhysicsBody>
          <PrototypeBox scale={[10, 1, 15]} position={[0, -0.5, 0]} />
        </BvhPhysicsBody>
      </Viverse>
    </Canvas>
  );
};
