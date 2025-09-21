"use client";

import { useFrame } from "@react-three/fiber";
import {
  PropsWithChildren,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import { Group, Vector3 } from "three";
import { SimpleCharacter } from "@react-three/viverse";

export type PlayerHandle = {
  /** 外部からプレイヤーのワールド座標を即時移動 */
  setPosition: (v: Vector3) => void;
  /** 内部の Three.js Group（SimpleCharacter の Object3D）を参照 */
  getObject3D: () => Group | null;
};

export type PlayerProps = PropsWithChildren<{
  /** SimpleCharacter の model プロップを透過（例: { type: 'vrm', url: '...' } | false） */
  model?: any;
  /** XR などの入力を透過 */
  input?: any;
  /** 既定のカメラ挙動を無効化する場合に使用 */
  cameraBehavior?: boolean;
  /** しきい値より落下したら原点へリスポーン（既定: -10） */
  fallThresholdY?: number;
}> &
  // SimpleCharacter にそのまま渡したい追加 props を許容
  Record<string, any>;

export const Player = forwardRef<PlayerHandle, PlayerProps>(
  (
    { children, model, input, cameraBehavior, fallThresholdY = -10, ...rest },
    ref
  ) => {
    const characterRef = useRef<Group>(null);

    const setPosition = useCallback((v: Vector3) => {
      const r = characterRef.current;
      if (!r) return;
      r.position.copy(v);
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        setPosition,
        getObject3D: () => characterRef.current,
      }),
      [setPosition]
    );

    useFrame(() => {
      const r = characterRef.current;
      if (!r) return;
      if (r.position.y < fallThresholdY) {
        setPosition(new Vector3(0, 0, 0));
      }
    });

    return (
      <SimpleCharacter
        // three の Group をそのまま受け取れる（既存コード互換）
        ref={characterRef as any}
        model={model}
        input={input}
        cameraBehavior={cameraBehavior}
        {...rest}
      >
        {children}
      </SimpleCharacter>
    );
  }
);
