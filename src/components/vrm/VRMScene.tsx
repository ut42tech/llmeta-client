import { VRMAvatar } from "@/components/VRMAvatar";
import { CameraControls, Environment, Gltf } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useControls } from "leva";
import { useRef } from "react";

// Available VRM model filenames for the UI
const AVATAR_OPTIONS = [
  "262410318834873893.vrm",
  "3859814441197244330.vrm",
  "3636451243928341470.vrm",
  "8087383217573817818.vrm",
] as const;

export const VRMScene = () => {
  // Keep ref if you intend to control the camera later
  const controls = useRef<CameraControls | null>(null);

  const { avatar } = useControls("VRM", {
    avatar: {
      value: AVATAR_OPTIONS[1],
      options: [...AVATAR_OPTIONS],
    },
  });

  return (
    <>
      <CameraControls
        ref={controls}
        maxPolarAngle={Math.PI / 2}
        minDistance={1}
        maxDistance={10}
      />
      {/* Lighting & environment */}
      <Environment preset="sunset" />
      <directionalLight intensity={2} position={[10, 10, 5]} />
      <directionalLight intensity={1} position={[-10, 10, 5]} />
      {/* Stage & avatar placement */}
      <group position-y={-1.25}>
        <VRMAvatar avatar={avatar} />
        <Gltf
          src="models/sound-stage-final.glb"
          position-z={-1.4}
          position-x={-0.5}
          scale={0.65}
        />
      </group>
      {/* Subtle bloom to make highlights pop */}
      <EffectComposer>
        <Bloom mipmapBlur intensity={0.7} />
      </EffectComposer>
    </>
  );
};
