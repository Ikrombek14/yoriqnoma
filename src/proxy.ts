import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { MAINTENANCE_MODE } from "@/lib/maintenance";

// Bo'sh, sarlavhasiz HTML — hech qanday xabar yoki dizayn ko'rsatilmaydi.
const BLANK_HTML = "<!DOCTYPE html><html><head></head><body></body></html>";

export async function proxy(request: NextRequest) {
  if (MAINTENANCE_MODE) {
    const { pathname } = request.nextUrl;
    const allowed =
      pathname.startsWith("/admin") || pathname.startsWith("/login");
    if (!allowed) {
      return new NextResponse(BLANK_HTML, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }
  }
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Quyidagilardan tashqari barcha so'rovlarga mos keladi:
     * - _next/static, _next/image, favicon, rasm/fayllar
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
