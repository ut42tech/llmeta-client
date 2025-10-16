import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/login?error=no_code`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/auth/login?error=${error.message}`);
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  const isDevelopment = process.env.NODE_ENV === "development";

  const redirectUrl = forwardedHost
    ? `${isDevelopment ? "http" : "https"}://${forwardedHost}${next}`
    : `${origin}${next}`;

  return NextResponse.redirect(redirectUrl);
}
