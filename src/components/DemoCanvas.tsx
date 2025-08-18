"use client";

import { DemoScene } from "@/components/DemoScene";
import { Canvas } from "@react-three/fiber";
import { FontFamilyProvider } from "@react-three/uikit";
import { BvhPhysicsWorld } from "@react-three/viverse";
import { Suspense } from "react";

export const DemoCanvas = () => {
  return (
    <Canvas
      className="!fixed !w-screen !h-screen"
      camera={{ fov: 90, position: [0, 2, 2] }}
      shadows
      gl={{ antialias: true, localClippingEnabled: true }}
    >
      <Suspense fallback={null}>
        <BvhPhysicsWorld>
          <FontFamilyProvider
            notoSans={{
              bold: "fonts/NotoSansJP-Bold.json",
            }}
          >
            <DemoScene />
          </FontFamilyProvider>
        </BvhPhysicsWorld>
      </Suspense>
    </Canvas>
  );
};
