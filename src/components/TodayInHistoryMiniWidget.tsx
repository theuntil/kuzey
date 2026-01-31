"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { pickBestPage, stripHtml, decodeWikiTitle } from "@/app/(home)/tarihte-bugun/shared/utils";
import type { OnThisDayEvent } from "@/app/(home)/tarihte-bugun/shared/types";

type ApiResponse = { events: OnThisDayEvent[] };

export default function TodayInHistoryMiniWidget() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<OnThisDayEvent[]>([]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    const ac = new AbortController();

    (async () => {
      try {
        const res = await fetch("/api/onthisday?limit=5", {
          method: "GET",
          signal: ac.signal,
          cache: "no-store",
        });
        const json = (await res.json()) as ApiResponse;
        setEvents(Array.isArray(json?.events) ? json.events : []);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      cancelAnimationFrame(raf);
      ac.abort();
    };
  }, []);

  const rows = useMemo(() => {
    return (events ?? []).slice(0, 5).map((ev) => {
      const page = pickBestPage(ev.pages);
      const titleRaw = page?.title ?? ""; // slug
      const eventText = stripHtml(ev.text ?? "");
      return {
        titleRaw,
        titleDecoded: stripHtml(decodeWikiTitle(titleRaw)),
        year: ev.year,
        eventText,
      };
    });
  }, [events]);

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm overflow-hidden">
      {/* Header */}
      <div
        className={[
          "mb-3 flex items-center justify-between gap-3",
          "transition-all duration-500 motion-reduce:transition-none",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1",
        ].join(" ")}
      >
        <div className="flex items-center gap-2 min-w-0">
          {/* Wikipedia logo (public/wikipedia.png) */}
          <span className="relative grid h-13 w-13 shrink-0 place-items-center rounded-2xl  overflow-hidden">
            <Image
              src="/w.png"
              alt="Wikipedia"
              fill
              sizes="36px"
              className="object-contain p-1"
              priority
            />
          </span>

        <p className="text-sm leading-tight text-zinc-900">
  <span className="font-light">Tarihte Bugün</span>{" "}
  <span className="font-bold">Ne oldu?</span>
</p>

        </div>

       
      </div>

      {/* Body */}
      {loading ? (
        <SkeletonList />
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-xs text-zinc-600">
          Veri alınamadı.
        </div>
      ) : (
        <div className="grid gap-2">
          {rows.map((r, i) => {
            // ✅ event + year query olarak gidiyor (detay sayfası “ne oldu”yu gösterecek)
            const href =
              `/tarihte-bugun/${encodeURIComponent(r.titleRaw)}` +
              `?year=${encodeURIComponent(String(r.year))}` +
              `&event=${encodeURIComponent(r.eventText)}`;

            return (
              <Link
                key={`${r.titleRaw}-${r.year}-${i}`}
                href={href}
                className={[
                  "group w-full overflow-hidden",
                  "rounded-2xl bg-white",
                  "px-3 py-3",
                  "transition",
                  "hover:bg-zinc-50",
                  "active:scale-[0.99]",
                  "focus:outline-none focus:ring-2 focus:ring-black/10",
                  "ring-1 ring-zinc-200/70 hover:ring-zinc-300",
                ].join(" ")}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* ✅ YIL KALDIRILDI (daha çok yer) */}

                  {/* Event text */}
                  <div className="min-w-0 flex-1">
                    <div
                      className="text-[12px] font-semibold text-zinc-900 leading-snug line-clamp-2"
                      title={r.eventText}
                    >
                      {r.eventText || "Olay bulunamadı"}
                    </div>

                    {/* küçük yardımcı satır: sayfa başlığı (opsiyonel, istersen kaldır) */}
                    {r.titleDecoded ? (
                      <div className="mt-1 text-[11px] text-zinc-500 truncate">
                        {r.titleDecoded}
                      </div>
                    ) : null}
                  </div>

                  <ChevronRight className="h-4 w-4 shrink-0 text-zinc-400 transition group-hover:text-zinc-700" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

function SkeletonList() {
  return (
    <div className="grid gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-white px-3 py-3 ring-1 ring-zinc-200/70 overflow-hidden"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-3 w-full rounded bg-zinc-200/70 animate-pulse" />
              <div className="h-3 w-4/5 rounded bg-zinc-200/70 animate-pulse" />
              <div className="h-3 w-2/3 rounded bg-zinc-200/70 animate-pulse" />
            </div>
            <div className="h-4 w-4 rounded bg-zinc-200/70 animate-pulse shrink-0" />
          </div>
        </div>
      ))}
    </div>
  );
}
