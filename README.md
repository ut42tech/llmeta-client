# Project LLMeta クライアント

Project LLMeta のフロントエンドアプリケーションです。3D 空間のレンダリング、ユーザーインタラクション、およびバックエンドサービスへの接続を担当します。

## 技術スタック

- **フレームワーク:** [Next.js](https://nextjs.org/)
- **言語:** [TypeScript](https://www.typescriptlang.org/)
- **3D レンダリング:**
  - [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
  - [@react-three/drei](https://github.com/pmndrs/drei)
- **XR:** [@react-three/xr](https://docs.pmnd.rs/react-xr/introduction)
- **マルチプレイヤー:** [Colyseus.js](https://docs.colyseus.io/colyseus/getting-started/javascript-client/)
- **UI:**
  - [Radix UI](https://www.radix-ui.com/)
  - [Tailwind CSS](https://tailwindcss.com/)

## 実行方法

1.  依存関係をインストールします。

    ```bash
    yarn install
    ```

2.  開発サーバーを起動します。
    ```bash
    yarn dev
    ```

アプリケーションは [http://localhost:3000](http://localhost:3000) で利用可能になります。

## 環境変数

1. `.env.local.example` を参考にプロジェクト直下で `.env.local` を作成し、必要な値を設定してください。

   ```bash
   cp .env.local.example .env.local
   ```

2. 設定する変数

   - `NEXT_PUBLIC_SUPABASE_URL`: Supabase API の URL (CLI のローカル環境では `http://127.0.0.1:54321`)

- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase の匿名キー (`supabase start` 実行時に表示される anon key を `supabase/.env` と併せて管理)
- `NEXT_PUBLIC_COLYSEUS_ENDPOINT`: Colyseus サーバーのエンドポイント (デフォルト: `ws://localhost:2567`)

## ディレクトリ構成

- **`src/app`**: アプリケーションの主要なページコンポーネント。
  - `experience/`: 体験ページ
  - `lobby/`: ロビーページ
  - `vrm/`: VRMアバタープレビューページ
- **`src/components`**: 再利用可能な React コンポーネント。
  - `experience/`: 体験関連のコンポーネント
  - `main/`: メインページ関連のコンポーネント
  - `player/`: プレイヤー関連のコンポーネント
  - `scene/`: 3Dシーン関連のコンポーネント
  - `ui/`: UI コンポーネント（Shadcn/ui）
  - `vrm/`: VRMアバター関連のコンポーネント
- **`src/hooks`**: カスタム React フック（camelCase命名規則）。
  - Colyseusとの接続ライフサイクル、リアルタイムプレゼンス、XRサポートなど
- **`src/types`**: 共有型定義。
  - `player.ts`: プレイヤー関連の型
  - `user.ts`: ユーザー関連の型
- **`src/stores`**: Zustandストア。
- **`src/utils`**: ユーティリティ関数。
- **`src/lib`**: ライブラリ設定（Supabaseなど）。
- **`public`**: 3D モデルやフォントなどの静的アセット。
