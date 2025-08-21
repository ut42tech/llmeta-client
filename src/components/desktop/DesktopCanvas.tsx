"use client";

import { MainScene } from "@/components/main/MainScene";
import { Canvas } from "@react-three/fiber";
import { BvhPhysicsWorld } from "@react-three/viverse";
import { Suspense } from "react";

export const DesktopCanvas = () => {
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
