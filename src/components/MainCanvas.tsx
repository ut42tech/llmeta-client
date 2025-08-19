"use client";

import { MainScene } from "@/components/MainScene";
import { Canvas } from "@react-three/fiber";
import { FontFamilyProvider } from "@react-three/uikit";
import { BvhPhysicsWorld } from "@react-three/viverse";
import { createXRStore, XR } from "@react-three/xr";
import { Suspense } from "react";

const store = createXRStore({
  offerSession: "immersive-vr",
  hand: { teleportPointer: true },
  controller: { teleportPointer: true },
});

export const MainCanvas = () => {
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
            <XR store={store}>
              <MainScene />
            </XR>
          </FontFamilyProvider>
        </BvhPhysicsWorld>
      </Suspense>
    </Canvas>
  );
};
