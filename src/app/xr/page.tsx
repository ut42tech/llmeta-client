"use client";

import { XRCanvas } from "@/components/xr/XRCanvas";
import { Loader } from "@react-three/drei";

export default function XRPage() {
  return (
    <div className="h-screen w-screen">
      <Loader />
      <XRCanvas />
    </div>
  );
}
