import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  const name = "Project LLMeta";
  const short_name = "Project LLMeta";
  const description =
    "LLM と WebXR/Three.js を活用した没入型メタバース体験アプリケーション";

  return {
    name,
    short_name,
    description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0b0f19",
    theme_color: "#0b0f19",
    lang: "ja",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
    screenshots: [
      {
        src: "/fonts/output.png",
        type: "image/png",
        form_factor: "wide",
        label: "City scene overview",
      },
    ],
    shortcuts: [
      {
        name: "XR モード",
        short_name: "XR",
        url: "/xr",
        description: "WebXR 体験をすぐに開始",
      },
      {
        name: "デスクトップ モード",
        short_name: "Desktop",
        url: "/desktop",
        description: "マウス・キーボードでの探索",
      },
    ],
    categories: ["entertainment", "games", "productivity"],
    prefer_related_applications: false,
  };
}
