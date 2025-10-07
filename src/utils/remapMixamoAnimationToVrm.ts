import type { VRM, VRMHumanBoneName } from "@pixiv/three-vrm";
import * as THREE from "three";
import { mixamoVRMRigMap } from "@/utils/mixamoVRMRigMap";

type HasAnimations = { animations?: THREE.AnimationClip[] };
type HasSceneLookup = {
  getObjectByName: (name: string) => THREE.Object3D | undefined;
};

/**
 * Mixamo の AnimationClip を VRM の Humanoid にリマップして返す。
 */
export function remapMixamoAnimationToVrm(
  vrm: VRM,
  asset: HasAnimations & HasSceneLookup,
) {
  if (!asset?.animations?.length)
    return new THREE.AnimationClip("vrmAnimation", 0, []);
  const baseClip = THREE.AnimationClip.findByName(
    asset.animations,
    "mixamo.com",
  );
  if (!baseClip) return new THREE.AnimationClip("vrmAnimation", 0, []);
  const clip = baseClip.clone();

  const tracks: THREE.KeyframeTrack[] = [];

  const restRotationInverse = new THREE.Quaternion();
  const parentRestWorldRotation = new THREE.Quaternion();
  const _quatA = new THREE.Quaternion();
  const _vec3 = new THREE.Vector3();

  // hips 高さからスケールを推定（両方取得できた場合のみ）
  const mixamoHips = asset.getObjectByName?.("mixamorigHips");
  const motionHipsHeight = mixamoHips?.position?.y;
  const vrmHipsNode = vrm?.humanoid?.getNormalizedBoneNode?.("hips");
  const vrmHipsY = vrmHipsNode?.getWorldPosition?.(_vec3)?.y;
  const vrmRootY = vrm?.scene?.getWorldPosition?.(_vec3)?.y;
  const vrmHipsHeight =
    typeof vrmHipsY === "number" && typeof vrmRootY === "number"
      ? Math.abs(vrmHipsY - vrmRootY)
      : undefined;
  const hipsPositionScale =
    typeof motionHipsHeight === "number" &&
    motionHipsHeight !== 0 &&
    typeof vrmHipsHeight === "number"
      ? vrmHipsHeight / motionHipsHeight
      : 1;

  clip.tracks.forEach((track: THREE.KeyframeTrack) => {
    const [mixamoRigName, propertyName] = track.name.split(".");
    const vrmBoneName = mixamoVRMRigMap[mixamoRigName];
    const vrmNodeName = vrmBoneName
      ? vrm?.humanoid?.getNormalizedBoneNode?.(vrmBoneName as VRMHumanBoneName)
          ?.name
      : undefined;
    const mixamoRigNode = asset.getObjectByName?.(mixamoRigName);

    if (!vrmNodeName || !mixamoRigNode || !propertyName) return;

    // Rest pose 回転を保存
    mixamoRigNode.getWorldQuaternion?.(restRotationInverse)?.invert?.();
    mixamoRigNode.parent?.getWorldQuaternion?.(parentRestWorldRotation);

    if (track instanceof THREE.QuaternionKeyframeTrack) {
      for (let i = 0; i < track.values.length; i += 4) {
        const flat = track.values.slice(i, i + 4);
        _quatA.fromArray(flat);
        _quatA
          .premultiply(parentRestWorldRotation)
          .multiply(restRotationInverse);
        _quatA.toArray(flat);
        flat.forEach((v, idx) => {
          track.values[idx + i] = v;
        });
      }

      tracks.push(
        new THREE.QuaternionKeyframeTrack(
          `${vrmNodeName}.${propertyName}`,
          track.times,
          track.values.map((v, i) =>
            vrm?.meta?.metaVersion === "0" && i % 2 === 0 ? -v : v,
          ),
        ),
      );
    } else if (track instanceof THREE.VectorKeyframeTrack) {
      const value = track.values.map(
        (v, i) =>
          (vrm?.meta?.metaVersion === "0" && i % 3 !== 1 ? -v : v) *
          hipsPositionScale,
      );
      tracks.push(
        new THREE.VectorKeyframeTrack(
          `${vrmNodeName}.${propertyName}`,
          track.times,
          value,
        ),
      );
    }
  });

  return new THREE.AnimationClip("vrmAnimation", clip.duration, tracks);
}
