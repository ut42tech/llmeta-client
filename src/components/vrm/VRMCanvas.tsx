import { VRMScene } from "@/components/vrm/VRMScene";
import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";

export const VRMCanvas = () => {
  return (
    <Canvas shadows camera={{ position: [0.25, 0.25, 2], fov: 30 }}>
      <color attach="background" args={["#333"]} />
      <fog attach="fog" args={["#333", 10, 20]} />
      <Suspense>
        <VRMScene />
      </Suspense>
    </Canvas>
  );
};
