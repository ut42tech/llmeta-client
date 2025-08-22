"use client";

import { MainCanvas } from "@/components/main/MainCanvas";
import { Loader } from "@react-three/drei";

export default function Home() {
  return (
    <div className="h-screen w-screen">
      <Loader />
      <MainCanvas />
    </div>
  );
}
