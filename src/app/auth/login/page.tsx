"use client";

import { Github } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    try {
      // Sign in with GitHub OAuth
      // If user has an anonymous session, Supabase will automatically link it
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error("Login error:", error);
        alert("ログインに失敗しました。もう一度お試しください。");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("ログインに失敗しました。もう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 px-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-900/50">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-white">
            Project LLMeta
          </CardTitle>
          <CardDescription className="text-center text-slate-400">
            GitHubアカウントでログイン
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGitHubLogin}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            <Github className="mr-2 h-5 w-5" />
            {isLoading ? "ログイン中..." : "GitHubでログイン"}
          </Button>

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => router.push("/")}
              className="text-slate-400 hover:text-white"
            >
              ホームに戻る
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
