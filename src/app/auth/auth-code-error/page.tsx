"use client";

import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 px-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-900/50">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-2xl text-center text-white">
            認証エラー
          </CardTitle>
          <CardDescription className="text-center text-slate-400">
            ログイン中にエラーが発生しました
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-center text-slate-400">
            認証コードの検証に失敗しました。もう一度ログインをお試しください。
          </p>

          <div className="flex flex-col gap-2">
            <Button asChild size="lg" className="w-full">
              <Link href="/auth/login">再度ログインする</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="/">ホームに戻る</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
