"use client";

import { ExperienceScene } from "@/components/experience/ExperienceScene";
import { Canvas } from "@react-three/fiber";
import { FontFamilyProvider } from "@react-three/uikit";
import { BvhPhysicsWorld } from "@react-three/viverse";
import { createXRStore, XR } from "@react-three/xr";
import { Suspense, useMemo } from "react";

type Props = {
  mode: "desktop" | "xr";
};

export const ExperienceCanvas = ({ mode }: Props) => {
  const xrStore = useMemo(() => {
    if (mode !== "xr") return null;
    return createXRStore({
      offerSession: "immersive-vr",
      hand: {
        left: { teleportPointer: false },
        right: { teleportPointer: true },
      },
      controller: {
        left: { teleportPointer: false },
        right: { teleportPointer: true },
      },
    });
  }, [mode]);

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
            {mode === "xr" && xrStore ? (
              <XR store={xrStore}>
                <ExperienceScene mode={mode} />
              </XR>
            ) : (
              <ExperienceScene mode={mode} />
            )}
          </FontFamilyProvider>
        </BvhPhysicsWorld>
      </Suspense>
    </Canvas>
  );
};
