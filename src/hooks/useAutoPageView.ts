"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/* ---------------- TYPES ---------------- */

type PageType =
  | "home"
  | "category"
  | "city"
  | "news"
  | "search"
  | "static"
  | "utility";

/* ---------------- HELPERS ---------------- */

function isUUID(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value
  );
}

function normalizePath(path: string) {
  // /haber-slug?x=y → /haber-slug
  return path.split("?")[0].replace(/\/+$/, "") || "/";
}

function detectPageType(path: string): PageType {
  if (path === "/") return "home";

  if (path.startsWith("/arama")) return "search";

  if (
    path.startsWith("/eczane") ||
    path.startsWith("/namaz") ||
    path.startsWith("/son-depremler") ||
    path.startsWith("/tarihte-bugun") ||
    path.startsWith("/piyasalar")
  ) {
    return "utility";
  }

  if (
    path.startsWith("/reklam") ||
    path.startsWith("/iletisim") ||
    path.startsWith("/kunye")
  ) {
    return "static";
  }

  const parts = path.split("/").filter(Boolean);

  // /kategori/slug → news
  if (parts.length === 2) {
    return "news";
  }

  // /spor , /gundem
  if (parts.length === 1) {
    return "category";
  }

  // /sehir/istanbul
  if (parts[0] === "sehir") {
    return "city";
  }

  return "static";
}

/* ---------------- HOOK ---------------- */

export function useAutoPageView(pageId?: string | null) {
  const pathnameRaw = usePathname();
  const sentRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathnameRaw) return;

    const pathname = normalizePath(pathnameRaw);

    /* ⛔ ADMIN & INTERNAL PAGES — ASLA SAYMA */
    if (pathname.startsWith("/admin")) return;
    if (pathname.startsWith("/_next")) return;
    if (pathname.startsWith("/api")) return;

    const page_type = detectPageType(pathname);

    /* ⛔ NEWS DEĞİLSE page_id GÖNDERME */
    let safePageId: string | null = null;

    if (page_type === "news" && pageId && isUUID(pageId)) {
      safePageId = pageId;
    }

    /* ⛔ KEY → DOUBLE COUNT KORUMASI */
    const key = `${page_type}|${pathname}|${safePageId ?? "none"}`;

    if (sentRef.current === key) return;
    sentRef.current = key;

    /* 🚀 FIRE & FORGET */
    fetch("/api/view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page_type,
        page_id: safePageId,
        path: pathname,
      }),
      keepalive: true,
    }).catch(() => {
      // intentionally ignored
    });
  }, [pathnameRaw, pageId]);
}
