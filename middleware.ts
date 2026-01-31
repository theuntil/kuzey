import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Varsayılan response (rewrite yaparsak aşağıda bunu değiştireceğiz)
  let res: NextResponse;

  // 🔥 /en/haber/* → /haber/* (REWRITE) + x-lang=en
  if (pathname.startsWith("/en/haber/")) {
    const slug = pathname.replace("/en/haber/", "");

    const url = req.nextUrl.clone();
    url.pathname = `/haber/${slug}`;

    res = NextResponse.rewrite(url);
    res.headers.set("x-lang", "en");
  }
  // 🔥 /en ve /en/* (rewrite yok) + x-lang=en
  else if (pathname === "/en" || pathname.startsWith("/en/")) {
    res = NextResponse.next();
    res.headers.set("x-lang", "en");
  }
  // Diğer tüm yollar
  else {
    res = NextResponse.next();
  }

  // ✅ visitor_id cookie (yoksa set et)
  if (!req.cookies.get("visitor_id")) {
    res.cookies.set("visitor_id", crypto.randomUUID(), {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 yıl
      // İstersen prod'da güçlendirebilirsin:
      // httpOnly: true,
      // sameSite: "lax",
      // secure: process.env.NODE_ENV === "production",
    });
  }

  return res;
}

// Matcher: hem /en/* hem genel cookie için çalışsın, _next ve tipik statikleri es geçsin
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
