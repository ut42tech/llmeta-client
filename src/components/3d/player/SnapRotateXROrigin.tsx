import { useFrame } from "@react-three/fiber";
import { useXRInputSourceState, XROrigin } from "@react-three/xr";
import { useRef } from "react";
import type { Group } from "three";

export const SnapRotateXROrigin = () => {
  const ref = useRef<Group>(null);
  const rightController = useXRInputSourceState("controller", "right");
  const prev = useRef(0);

  useFrame(() => {
    if (ref.current == null) return;

    const current = Math.round(
      rightController?.gamepad?.["xr-standard-thumbstick"]?.xAxis ?? 0,
    );
    if (current < 0 && prev.current >= 0) {
      // Rotate left
      ref.current.rotation.y += Math.PI / 6;
    }
    if (current > 0 && prev.current <= 0) {
      // Rotate right
      ref.current.rotation.y -= Math.PI / 6;
    }
    prev.current = current;
  });

  return <XROrigin ref={ref} />;
};
