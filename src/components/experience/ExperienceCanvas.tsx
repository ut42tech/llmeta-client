"use client";

import { Canvas } from "@react-three/fiber";
import { FontFamilyProvider } from "@react-three/uikit";
import { BvhPhysicsWorld } from "@react-three/viverse";
import { createXRStore, XR } from "@react-three/xr";
import { Suspense, useMemo } from "react";
import { ExperienceScene } from "@/components/experience/ExperienceScene";

type Props = {
  mode: "desktop" | "xr";
};

export const ExperienceCanvas = ({ mode }: Props) => {
  // 常時 XR でラップするが、store は安定参照にして再作成を避ける
  const xrStore = useMemo(
    () =>
      createXRStore({
        offerSession: "immersive-vr",
        hand: {
          left: { teleportPointer: false },
          right: { teleportPointer: true },
        },
        controller: {
          left: { teleportPointer: false },
          right: { teleportPointer: true },
        },
      }),
    [],
  );

  return (
    <Canvas
      className="!fixed !w-screen !h-screen"
      shadows
      gl={{ antialias: true, localClippingEnabled: true }}
      onClick={(e) => (e.target as HTMLElement).requestPointerLock()}
    >
      <Suspense fallback={null}>
        <BvhPhysicsWorld>
          <FontFamilyProvider
            notoSans={{
              bold: "fonts/NotoSansJP-Bold.json",
            }}
          >
            <XR store={xrStore}>
              <ExperienceScene mode={mode} />
            </XR>
          </FontFamilyProvider>
        </BvhPhysicsWorld>
      </Suspense>
    </Canvas>
  );
};
