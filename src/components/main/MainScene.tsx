"use client";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Level } from "@/components/scene/Level";

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
