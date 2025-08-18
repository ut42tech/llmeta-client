import { DemoScene } from "@/components/DemoScene";
import { Canvas } from "@react-three/fiber";
import { Viverse } from "@react-three/viverse";
import { Suspense } from "react";

export const DemoCanvas = () => {
  return (
    <Canvas
      style={{ position: "absolute", inset: "0", touchAction: "none" }}
      camera={{ fov: 90, position: [0, 2, 2] }}
      shadows
    >
      <Suspense fallback={null}>
        <Viverse>
          <DemoScene />
        </Viverse>
      </Suspense>
    </Canvas>
  );
};
