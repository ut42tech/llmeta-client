import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP, Roboto } from "next/font/google";
import "./globals.css";

const noto_Sans_JP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const metadataBase = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
);

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: "Project LLMeta",
    template: "%s | Project LLMeta",
  },
  applicationName: "Project LLMeta",
  description:
    "LLM と WebXR/Three.js を活用した没入型メタバース体験アプリケーション",
  keywords: [
    "メタバース",
    "WebXR",
    "Three.js",
    "React Three Fiber",
    "R3F",
    "LLM",
    "AI",
    "Next.js",
  ],
  authors: [{ name: "ut42tech" }],
  creator: "ut42tech",
  publisher: "ut42tech",
  category: "communication",
  alternates: {
    canonical: "/",
  },
  referrer: "strict-origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Project LLMeta",
    description:
      "LLM と WebXR/Three.js を活用した没入型メタバース体験アプリケーション",
    siteName: "Project LLMeta",
    locale: "ja_JP",
    images: [
      {
        url: "/fonts/output.png",
        width: 1200,
        height: 630,
        alt: "Project LLMeta preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Project LLMeta",
    description:
      "LLM と WebXR/Three.js を活用した没入型メタバース体験アプリケーション。",
    images: ["/fonts/output.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Project LLMeta",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f19" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${noto_Sans_JP.variable} ${roboto.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
