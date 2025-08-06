"use client";

import { AnimatedWoman } from "@/components/AnimatedWoman";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";

export const Experience = () => {
  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.5} />
      <ContactShadows blur={2} />
      <OrbitControls />
      <AnimatedWoman />
      <AnimatedWoman position-x={1} />
    </>
  );
};
