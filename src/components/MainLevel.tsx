import { Map } from "@/components/Map";
import { Sky } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { BvhPhysicsBody, PrototypeBox } from "@react-three/viverse";
import { TeleportTarget } from "@react-three/xr";
import { Vector3 } from "three";

type MainLevelProps = {
  onTeleport?: (position: Vector3) => void;
};

export const MainLevel = (props: MainLevelProps) => {
  return (
    <>
      <Sky />

      {/* Lighting - expanded with shadow settings */}
      <directionalLight intensity={1.2} position={[5, 10, 10]} castShadow />
      <ambientLight intensity={1} />

      <TeleportTarget onTeleport={props.onTeleport}>
        <BvhPhysicsBody>
          <PrototypeBox
            color="#fafafa"
            scale={[10, 1, 10]}
            position={[0, -1, 0]}
          />
          <Physics>
            <Map position={[0, 0, 0]} model={"models/city_scene_tokyo.glb"} />
          </Physics>
        </BvhPhysicsBody>
      </TeleportTarget>
    </>
  );
};
