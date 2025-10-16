"use client";

import { Canvas } from "@react-three/fiber";
import { BvhPhysicsWorld } from "@react-three/viverse";
import { Suspense } from "react";
import { MainScene } from "@/components/3d/page/main/MainScene";

export const MainCanvas = () => {
  return (
    <Canvas
      className="!fixed !w-screen !h-screen"
      shadows
      gl={{ antialias: true, localClippingEnabled: true }}
    >
      <Suspense fallback={null}>
        <BvhPhysicsWorld>
          <MainScene />
        </BvhPhysicsWorld>
      </Suspense>
    </Canvas>
  );
};
