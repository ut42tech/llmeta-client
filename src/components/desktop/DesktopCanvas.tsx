"use client";

import { DesktopScene } from "@/components/desktop/DesktopScene";
import { Canvas } from "@react-three/fiber";
import { FontFamilyProvider } from "@react-three/uikit";
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
          <FontFamilyProvider
            notoSans={{
              bold: "fonts/NotoSansJP-Bold.json",
            }}
          >
            <DesktopScene />
          </FontFamilyProvider>
        </BvhPhysicsWorld>
      </Suspense>
    </Canvas>
  );
};
