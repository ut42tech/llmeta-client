import { remapMixamoAnimationToVrm } from "@/utils/remapMixamoAnimationToVrm";
import { VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";
import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useEffect, useMemo } from "react";
import { Euler, Object3D, Quaternion, Vector3 } from "three";
import { lerp } from "three/src/math/MathUtils.js";

const tmpVec3 = new Vector3();
const tmpQuat = new Quaternion();
const tmpEuler = new Euler();

type VRMAvatarProps = {
  avatar: string;
} & Record<string, unknown>;

export const VRMAvatar = ({ avatar, ...props }: VRMAvatarProps) => {
  const { scene, userData } = useGLTF(
    `models/${avatar}`,
    undefined,
    undefined,
    (loader) => {
      // drei の GLTFLoader 型と three-vrm の型が食い違うため any で吸収
      (loader as any).register((parser: any) => {
        return new VRMLoaderPlugin(parser as any);
      });
    }
  );

  const assetA = useFBX("models/animations/Swing Dancing.fbx");
  const assetB = useFBX("models/animations/Thriller Part 2.fbx");
  const assetC = useFBX("models/animations/Breathing Idle.fbx");

  const currentVrm: any = (userData as any).vrm;

  const animationClipA = useMemo(() => {
    const clip = remapMixamoAnimationToVrm(currentVrm, assetA);
    clip.name = "Swing Dancing";
    return clip;
  }, [assetA, currentVrm]);

  const animationClipB = useMemo(() => {
    const clip = remapMixamoAnimationToVrm(currentVrm, assetB);
    clip.name = "Thriller Part 2";
    return clip;
  }, [assetB, currentVrm]);

  const animationClipC = useMemo(() => {
    const clip = remapMixamoAnimationToVrm(currentVrm, assetC);
    clip.name = "Idle";
    return clip;
  }, [assetC, currentVrm]);

  const { actions } = useAnimations(
    [animationClipA, animationClipB, animationClipC],
    currentVrm?.scene as any
  );

  useEffect(() => {
    const vrm: any = (userData as any).vrm;
    console.log("VRM loaded:", vrm);
    // calling these functions greatly improves the performance
    VRMUtils.removeUnnecessaryVertices(scene as unknown as Object3D);
    VRMUtils.combineSkeletons(scene as unknown as Object3D);
    VRMUtils.combineMorphs(vrm);

    // Disable frustum culling
    (vrm.scene as Object3D).traverse((obj: any) => {
      (obj as any).frustumCulled = false;
    });
  }, [scene]);

  // MediaPipe/Camera 機能は削除済み

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
      options: ["None", "Idle", "Swing Dancing", "Thriller Part 2"],
      value: "Idle",
    },
  });

  useEffect(() => {
    if (animation === "None") return;
    actions[animation]?.play();
    return () => {
      actions[animation]?.stop();
    };
  }, [actions, animation]);

  const lerpExpression = (name: string, value: number, lerpFactor: number) => {
    (userData as any).vrm.expressionManager.setValue(
      name,
      lerp(
        (userData as any).vrm.expressionManager.getValue(name),
        value,
        lerpFactor
      )
    );
  };

  const rotateBone = (
    boneName: string,
    value: { x: number; y: number; z: number },
    slerpFactor: number,
    flip = {
      x: 1,
      y: 1,
      z: 1,
    }
  ) => {
    const bone = (userData as any).vrm.humanoid.getNormalizedBoneNode(
      boneName
    ) as any;
    if (!bone) {
      console.warn(
        `Bone ${boneName} not found in VRM humanoid. Check the bone name.`
      );
      console.log(
        "userData.vrm.humanoid.bones",
        (userData as any).vrm.humanoid
      );
      return;
    }

    tmpEuler.set(value.x * flip.x, value.y * flip.y, value.z * flip.z);
    tmpQuat.setFromEuler(tmpEuler);
    bone.quaternion.slerp(tmpQuat, slerpFactor);
  };

  useFrame((_, delta) => {
    if (!(userData as any).vrm) {
      return;
    }
    (userData as any).vrm.expressionManager.setValue("angry", angry);
    (userData as any).vrm.expressionManager.setValue("sad", sad);
    (userData as any).vrm.expressionManager.setValue("happy", happy);
    [
      { name: "aa", value: aa },
      { name: "ih", value: ih },
      { name: "ee", value: ee },
      { name: "oh", value: oh },
      { name: "ou", value: ou },
      { name: "blinkLeft", value: blinkLeft },
      { name: "blinkRight", value: blinkRight },
    ].forEach((item) => {
      lerpExpression(item.name, item.value, delta * 12);
    });

    (userData as any).vrm.update(delta);
  });

  return (
    <group {...props}>
      <primitive
        object={scene}
        rotation-y={avatar !== "3636451243928341470.vrm" ? Math.PI : 0}
      />
    </group>
  );
};
