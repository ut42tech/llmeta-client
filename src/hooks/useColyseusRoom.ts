"use client";

import { useEffect, useRef, useState } from "react";
import type { Room } from "colyseus.js";
import { useColyseusClient } from "@/hooks/useColyseusClient";

export type PlayerSummary = {
  id: string;
  x: number;
  y: number;
  z: number;
};

/**
 * 最小の Colyseus ルーム接続フック
 * - joinOrCreate(roomName)
 * - state.players を toJSON() して配列化
 * - アンマウント時に leave()
 */
export function useColyseusRoom<TState extends { players?: any }>(
  roomName: string,
  options: Record<string, any> = {}
) {
  const client = useColyseusClient();
  const roomRef = useRef<Room<TState> | null>(null);

  const [isConnecting, setIsConnecting] = useState(true);
  const [players, setPlayers] = useState<PlayerSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Colyseus の players (MapSchema/ArraySchema/Plain Object) を配列に正規化
  function normalizePlayers(input: any): PlayerSummary[] {
    if (!input) return [];

    // toJSON がある場合は一度プレーン化
    const jsonLike =
      typeof input?.toJSON === "function" ? input.toJSON() : input;

    // ArraySchema や配列ケース
    if (Array.isArray(jsonLike)) {
      return jsonLike.map((p: any, idx: number) => ({
        id: String(p?.id ?? idx),
        x: Number(p?.x ?? 0),
        y: Number(p?.y ?? 0),
        z: Number(p?.z ?? 0),
      }));
    }

    // MapSchema -> { key: player, ... }
    if (typeof jsonLike === "object") {
      return Object.entries(jsonLike).map(([key, p]: [string, any]) => ({
        id: String(p?.id ?? key),
        x: Number(p?.x ?? 0),
        y: Number(p?.y ?? 0),
        z: Number(p?.z ?? 0),
      }));
    }

    return [];
  }

  useEffect(() => {
    if (!client) return;

    setIsConnecting(true);
    setError(null);

    const req = client.joinOrCreate<TState>(roomName, options);

    req
      .then((room) => {
        roomRef.current = room;
        setIsConnecting(false);

        // 状態変更時に players を同期
        room.onStateChange((state: any) => {
          const list = normalizePlayers(state?.players);
          setPlayers(list);
        });
      })
      .catch((e) => {
        console.error("Failed to joinOrCreate room:", e);
        setError(e?.message ?? String(e));
        setIsConnecting(false);
      });

    return () => {
      req.then((room) => room.leave()).catch(() => void 0);
      roomRef.current = null;
    };
  }, [client, roomName]);

  return { room: roomRef.current, isConnecting, players, error } as const;
}
