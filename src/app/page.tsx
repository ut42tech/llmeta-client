"use client";

import { Experience } from "@/components/Experience";
import { SocketManager } from "@/components/SocketManager";
import { Canvas } from "@react-three/fiber";
export default function Home() {
  return (
    <div className="h-screen w-screen">
      <SocketManager />
      <Canvas shadows camera={{ position: [8, 8, 8], fov: 30 }}>
        <color attach={"background"} args={["#ececec"]} />
        <Experience />
      </Canvas>
    </div>
  );
}
