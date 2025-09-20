"use client";

import { useMemo } from "react";
import { Client } from "colyseus.js";

/**
 * Colyseus クライアントを返す軽量フック。
 * - 環境変数 NEXT_PUBLIC_SERVER_ENDPOINT を使用（未設定時は http://localhost:2567）
 * - useMemo で同一レンダー中のインスタンス再生成を防止
 */
export const useColyseusClient = (): Client | null => {
  const endpoint =
    process.env.NEXT_PUBLIC_SERVER_ENDPOINT || "http://localhost:2567";

  // Client はブラウザ API に依存するため、クライアント環境でのみ生成
  const client = useMemo(() => {
    try {
      return new Client(endpoint);
    } catch {
      // まれに SSR 経路や初期化タイミングで失敗しうるため null フォールバック
      return null;
    }
  }, [endpoint]);

  return client;
};
