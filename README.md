# Project LLMeta クライアント

Project LLMeta のフロントエンドアプリケーションです。3D空間のレンダリング、ユーザーインタラクション、およびバックエンドサービスへの接続を担当します。

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

- `NEXT_PUBLIC_COLYSEUS_ENDPOINT`: Colyseus サーバーのエンドポイントを指定します (デフォルト: `ws://localhost:2567`)。

## ディレクトリ構成

- **`src/app`**: アプリケーションの主要なページコンポーネント。
- **`src/components`**: 再利用可能な React コンポーネント。
- **`src/hooks`**: Colyseus との接続ライフサイクルなど、カスタム React フック。
- **`src/utils`**: ユーティリティ関数。
- **`public`**: 3Dモデルやフォントなどの静的アセット。