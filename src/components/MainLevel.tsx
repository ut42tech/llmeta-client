import { Map } from "@/components/Map";
import { Cloud, Clouds, Environment, Sky } from "@react-three/drei";
import { Bloom, EffectComposer, SMAA, SSAO } from "@react-three/postprocessing";
import { Physics } from "@react-three/rapier";
import { BvhPhysicsBody, PrototypeBox } from "@react-three/viverse";
import { TeleportTarget } from "@react-three/xr";
import { Vector3 } from "three";
import * as THREE from "three";

type MainLevelProps = {
  onTeleport?: (position: Vector3) => void;
};

export const MainLevel = (props: MainLevelProps) => {
  return (
    <>
      {/* Image-based lighting for more realistic PBR response */}
      <Environment preset="sunset" />
      <Sky />
      <Clouds material={THREE.MeshBasicMaterial} position={[16, 25, -16]}>
        <Cloud segments={30} bounds={[20, 1, 20]} volume={10} color="white" />
      </Clouds>

      {/* Lighting - expanded with shadow settings */}
      <directionalLight
        castShadow
        position={[50, 80, 50]}
        intensity={2}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.001}
        shadow-normalBias={0.02}
        shadow-camera-near={1}
        shadow-camera-far={400}
        shadow-camera-top={150}
        shadow-camera-bottom={-150}
        shadow-camera-left={-150}
        shadow-camera-right={150}
      />
      {/* Low ambient to keep contrast while avoiding pitch-black areas */}
      <ambientLight intensity={0.35} />

      <TeleportTarget onTeleport={props.onTeleport}>
        <BvhPhysicsBody>
          {/* <PrototypeBox
            color="#fafafa"
            scale={[10, 1, 10]}
            position={[0, -1, 0]}
          /> */}
          <Physics>
            <Map
              scale={[2, 2, 2]}
              position={[-2, -0.7, -16]}
              model={"models/city_scene_tokyo.glb"}
            />
          </Physics>
        </BvhPhysicsBody>
      </TeleportTarget>

      {/* Post-processing pipeline: SMAA AA + SSAO + gentle bloom */}
      {/* <EffectComposer enableNormalPass>
        <SMAA />
        <SSAO />
        <Bloom />
      </EffectComposer> */}
    </>
  );
};
