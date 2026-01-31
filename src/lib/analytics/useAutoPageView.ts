"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function useAutoPageView(newsId?: string) {
  const pathname = usePathname();
  const firedRef = useRef(false);

  useEffect(() => {
    // aynı render’da 2 kere çalışmasını engeller
    if (firedRef.current) return;
    firedRef.current = true;

    fetch("/api/track-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contentType: newsId ? "news" : "static",
        contentId: newsId ?? null,
        route: pathname,
      }),
    }).catch(() => {});
  }, [pathname, newsId]);
}
