"use client";

import { VRMScene } from "@/components/VRMScene";
import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

function VRMPage() {
  return (
    <div className="h-screen w-screen">
      <Loader />
      <Canvas shadows camera={{ position: [0.25, 0.25, 2], fov: 30 }}>
        <color attach="background" args={["#333"]} />
        <fog attach="fog" args={["#333", 10, 20]} />
        {/* <Stats /> */}
        <Suspense>
          <VRMScene />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default VRMPage;
