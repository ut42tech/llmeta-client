import { DemoScene } from "@/components/DemoScene";
import { Canvas } from "@react-three/fiber";
import { Viverse } from "@react-three/viverse";
import { createXRStore, XR } from "@react-three/xr";
import { Suspense } from "react";

const store = createXRStore({
  offerSession: "immersive-vr",
});

export const DemoCanvas = () => {
  return (
    <Canvas
      style={{ position: "absolute", inset: "0", touchAction: "none" }}
      camera={{ fov: 90, position: [0, 2, 2] }}
      onClick={(e) => (e.target as HTMLElement).requestPointerLock()}
      shadows
      gl={{ antialias: true, localClippingEnabled: true }}
    >
      <Suspense fallback={null}>
        <Viverse>
          <XR store={store}>
            <DemoScene />
          </XR>
        </Viverse>
      </Suspense>
    </Canvas>
  );
};
