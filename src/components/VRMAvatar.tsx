import { remapMixamoAnimationToVrm } from "@/utils/remapMixamoAnimationToVrm";
import { VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";
import type { VRM } from "@pixiv/three-vrm";
import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useEffect, useMemo } from "react";
import { Object3D } from "three";
import { lerp } from "three/src/math/MathUtils.js";

// Animation label constants
const ANIM = {
  NONE: "None",
  IDLE: "Idle",
  SWING: "Swing Dancing",
  THRILLER: "Thriller Part 2",
} as const;

type VRMAvatarProps = {
  avatar: string;
} & Record<string, unknown>;

export const VRMAvatar = ({ avatar, ...props }: VRMAvatarProps) => {
  const { scene, userData } = useGLTF(
    `models/${avatar}`,
    undefined,
    undefined,
    (loader) => {
      (loader as any).register((parser: any) => {
        return new VRMLoaderPlugin(parser as any);
      });
    }
  );

  // Current VRM instance extracted for clarity
  const vrm = (userData as any).vrm as VRM | undefined;

  const assetA = useFBX("models/animations/Swing Dancing.fbx");
  const assetB = useFBX("models/animations/Thriller Part 2.fbx");
  const assetC = useFBX("models/animations/Breathing Idle.fbx");

  const animationClipA = useMemo(() => {
    const clip = remapMixamoAnimationToVrm(vrm as any, assetA);
    clip.name = ANIM.SWING;
    return clip;
  }, [assetA, vrm]);

  const animationClipB = useMemo(() => {
    const clip = remapMixamoAnimationToVrm(vrm as any, assetB);
    clip.name = ANIM.THRILLER;
    return clip;
  }, [assetB, vrm]);

  const animationClipC = useMemo(() => {
    const clip = remapMixamoAnimationToVrm(vrm as any, assetC);
    clip.name = ANIM.IDLE;
    return clip;
  }, [assetC, vrm]);

  const { actions } = useAnimations(
    [animationClipA, animationClipB, animationClipC],
    vrm?.scene as any
  );

  useEffect(() => {
    const v = (userData as any).vrm as VRM | undefined;
    if (!v) return;
    VRMUtils.removeUnnecessaryVertices(scene as unknown as Object3D);
    VRMUtils.combineSkeletons(scene as unknown as Object3D);
    VRMUtils.combineMorphs(v);

    // Disable frustum culling
    v.scene.traverse((obj) => {
      (obj as any).frustumCulled = false;
    });
  }, [scene]);

  const {
    aa,
    ih,
    ee,
    oh,
    ou,
    blinkLeft,
    blinkRight,
    angry,
    sad,
    happy,
    animation,
  } = useControls("VRM", {
    aa: { value: 0, min: 0, max: 1 },
    ih: { value: 0, min: 0, max: 1 },
    ee: { value: 0, min: 0, max: 1 },
    oh: { value: 0, min: 0, max: 1 },
    ou: { value: 0, min: 0, max: 1 },
    blinkLeft: { value: 0, min: 0, max: 1 },
    blinkRight: { value: 0, min: 0, max: 1 },
    angry: { value: 0, min: 0, max: 1 },
    sad: { value: 0, min: 0, max: 1 },
    happy: { value: 0, min: 0, max: 1 },
    animation: {
      options: [ANIM.NONE, ANIM.IDLE, ANIM.SWING, ANIM.THRILLER],
      value: ANIM.IDLE,
    },
  });

  useEffect(() => {
    if (animation === ANIM.NONE) return;
    actions[animation]?.play();
    return () => {
      actions[animation]?.stop();
    };
  }, [actions, animation]);

  const lerpExpression = (
    manager: NonNullable<VRM["expressionManager"]>,
    name: string,
    value: number,
    lerpFactor: number
  ) => {
    const current = manager.getValue(name) ?? 0;
    manager.setValue(name, lerp(current, value, lerpFactor));
  };

  useFrame((_, delta) => {
    const v = (userData as any).vrm as VRM | undefined;
    if (!v) return;

    const manager = v.expressionManager;
    if (manager) {
      // Base expressions
      manager.setValue("angry", angry);
      manager.setValue("sad", sad);
      manager.setValue("happy", happy);
      [
        { name: "aa", value: aa },
        { name: "ih", value: ih },
        { name: "ee", value: ee },
        { name: "oh", value: oh },
        { name: "ou", value: ou },
        { name: "blinkLeft", value: blinkLeft },
        { name: "blinkRight", value: blinkRight },
      ].forEach((item) => {
        lerpExpression(manager, item.name, item.value, delta * 12);
      });
    }

    v.update(delta);
  });

  return (
    <group {...props}>
      {/* Some VRM models face opposite; unify facing direction */}
      <primitive object={scene} rotation-y={Math.PI} />
    </group>
  );
};
