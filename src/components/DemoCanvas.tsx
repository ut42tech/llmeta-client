"use client";

import { DemoScene } from "@/components/DemoScene";
import { Canvas } from "@react-three/fiber";
import { FontFamilyProvider } from "@react-three/uikit";
import { BvhPhysicsWorld } from "@react-three/viverse";
import { createXRStore, XR } from "@react-three/xr";
import { Suspense } from "react";

const store = createXRStore({ offerSession: "immersive-vr" });

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
            <XR store={store}>
              <DemoScene />
            </XR>
          </FontFamilyProvider>
        </BvhPhysicsWorld>
      </Suspense>
    </Canvas>
  );
};
