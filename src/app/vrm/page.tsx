"use client";

import { VRMCanvas } from "@/components/vrm/VRMCanvas";
import { Loader } from "@react-three/drei";

function VRMPage() {
  return (
    <div className="h-screen w-screen">
      <Loader />
      <VRMCanvas />
    </div>
  );
}

export default VRMPage;
