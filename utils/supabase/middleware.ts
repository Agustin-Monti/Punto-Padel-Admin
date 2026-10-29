// utils/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresca la sesión si expiró
  const { data: { user } } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // 1. Si intenta entrar al dashboard SIN sesión, lo manda a /admin
  if (!user && path.startsWith("/admin/dashboard")) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // 2. Si YA tiene sesión y está en /admin (el login), lo manda al dashboard
  if (user && path === "/admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return response;
};