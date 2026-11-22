import { NextResponse, type NextRequest } from "next/server";
import { THEME } from "@/config/theme";
import { SESSION_COOKIE, verifySession } from "@/lib/auth/session";
import { isRetiredSlug } from "@/lib/retired";

// A page can't set a 410 status, so this small self-contained page is served from here.
const GONE_HTML = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Page removed · Rytora Studio</title><style>
body{margin:0;min-height:100vh;display:grid;align-content:center;padding:24px clamp(20px,8vw,120px);box-sizing:border-box;background:${THEME.paper};color:${THEME.ink};font:16px/1.65 system-ui,sans-serif}
h1{margin:16px 0;font:700 clamp(40px,8vw,88px)/1 "Archivo","Arial Narrow",Arial,sans-serif;text-transform:uppercase}
nav{display:flex;flex-wrap:wrap;gap:12px 24px;margin-top:24px}a{display:inline-flex;align-items:center;min-height:44px;color:inherit}a:focus-visible{outline:2px solid ${THEME.accent};outline-offset:3px}
</style></head><body><main><p>Error 410</p><h1>This page has been removed.</h1><p>It is no longer part of our portfolio.</p><nav><a href="/">Home</a><a href="/contact">Contact us</a></nav></main></body></html>`;

function gone() {
  return new NextResponse(GONE_HTML, {
    status: 410,
    headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex", "cache-control": "public, max-age=0, must-revalidate" },
  });
}

/**
 * - Withdrawn project URLs answer 410 Gone.
 * - Other /projects/:slug URLs from the previous site move to /work/:slug. This
 *   can't live in next.config: redirects there run before the proxy, so a
 *   withdrawn URL would redirect first.
 * - Optimistic admin gate: bounce anyone without a valid session cookie to the
 *   login page before rendering. The authoritative check is requireAdmin() in
 *   every admin page and server action.
 */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const [, section, slug] = pathname.split("/");

  if (section === "work" || section === "projects") {
    if (slug && isRetiredSlug(slug)) return gone();
    if (section === "projects" && slug) {
      const url = req.nextUrl.clone();
      url.pathname = pathname.replace("/projects/", "/work/");
      return NextResponse.redirect(url, 308);
    }
    return NextResponse.next();
  }

  if (pathname === "/admin/login") return NextResponse.next();

  const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value, process.env.SESSION_SECRET ?? "");
  if (!session) {
    const url = new URL("/admin/login", req.nextUrl);
    if (pathname !== "/admin") url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/work/:path+", "/projects/:path+"],
};
