"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Image as ImageIcon, History } from "lucide-react";
import type { OnThisDayEvent } from "./types";
import { pickBestPage, decodeWikiTitle, stripHtml } from "./utils";
import { useAutoPageView } from "@/lib/analytics/useAutoPageView";
export default function TodayInHistoryClient({
  initialEvents,
  dateLabel,
}: {
  initialEvents: OnThisDayEvent[];
  dateLabel: string;
}) {
 useAutoPageView(); 
  const [mounted, setMounted] = useState(false);
  const [events, setEvents] = useState<OnThisDayEvent[] | null>(null);

  useEffect(() => {
    
    const id = requestAnimationFrame(() => setMounted(true));
    const t = window.setTimeout(() => setEvents(initialEvents), 90);
    return () => {
      cancelAnimationFrame(id);
      window.clearTimeout(t);
    };
  }, [initialEvents]);

  const rows = useMemo(() => {
    const src = events ?? [];
    return src.map((ev) => {
      const page = pickBestPage(ev.pages);
      const titleRaw = page?.title ?? "";
      const titleDecoded = decodeWikiTitle(titleRaw);
      const thumb = page?.thumbnail?.source ?? null;

      return {
        year: ev.year,
        text: ev.text,
        titleRaw,
        titleDecoded,
        thumb,
      };
    });
  }, [events]);

  return (
    <main className="min-h-dvh ">
      <div
        className={[
          "mx-auto w-full max-w-6xl px-4 py-6",
          "transition-all duration-500 motion-reduce:transition-none",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        ].join(" ")}
      >
        {/* Header */}
        <header className="mb-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600">
                <span className="grid h-8 w-8 place-items-center rounded-2xl bg-zinc-50 ring-1 ring-zinc-200">
                  <History className="h-4 w-4 text-zinc-700" />
                </span>
                <span>Bugün Tarihte</span>
              </div>

              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">
                Tarihte Bugün Ne Oldu?
              </h1>
              <p className="mt-2 text-sm text-zinc-500">{dateLabel}</p>

              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-700">
                Wikimedia verisiyle, bugüne denk gelen tarihi olayların öne çıkanlarını listeliyoruz.
                Bir olaya tıklayınca hem “o gün ne oldu” bilgisini hem de ilgili Wikipedia özetini görürsünüz.
              </p>
            </div>

            <div className="hidden sm:block shrink-0">
              <div className="grid h-14 w-14 place-items-center rounded-3xl bg-zinc-900 text-white shadow-sm">
                <History className="h-6 w-6" />
              </div>
            </div>
          </div>
        </header>

        {/* Grid */}
        {events === null ? (
          <SkeletonGrid />
        ) : events.length === 0 ? (
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600 shadow-sm">
            Veri alınamadı. Lütfen daha sonra tekrar deneyin.
          </div>
        ) : (
          <section className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {rows.map((r, idx) => {
              // ✅ Detay sayfasında “o gün ne oldu” gösterebilmek için query taşıyoruz
              const href =
                `/tarihte-bugun/${encodeURIComponent(r.titleRaw || r.titleDecoded)}` +
                `?year=${encodeURIComponent(String(r.year))}` +
                `&event=${encodeURIComponent(stripHtml(r.text))}`;

              return (
                <Link
                  key={`${r.year}-${idx}`}
                  href={href}
                  className={[
                    "group rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm",
                    "transition",
                    "hover:border-zinc-300 hover:shadow-md",
                    "active:scale-[0.99]",
                    "focus:outline-none focus:ring-2 focus:ring-black/10",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-4">
                    {/* Thumb */}
                    <div className="shrink-0">
                      <div className="relative h-[64px] w-[64px] overflow-hidden rounded-2xl bg-zinc-100 ring-1 ring-zinc-200">
                        {r.thumb ? (
                          <Image
                            src={r.thumb}
                            alt=""
                            fill
                            sizes="64px"
                            className="object-cover transition duration-300 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center">
                            <ImageIcon className="h-5 w-5 text-zinc-400" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Text */}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-zinc-400">{r.year}</p>
                      <p className="mt-1 text-sm font-semibold leading-snug text-zinc-900 line-clamp-3">
                        {stripHtml(r.text)}
                      </p>

                      <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-zinc-500">
                        <span className="truncate">
                          {r.titleDecoded || r.titleRaw}
                        </span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-zinc-400 transition group-hover:text-zinc-700" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </section>
        )}

        <p className="mt-6 text-xs text-zinc-500">
          Kaynak: Wikimedia “On this day” feed (TR)
        </p>
      </div>
    </main>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="h-[64px] w-[64px] rounded-2xl bg-zinc-200/70 animate-pulse" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-3 w-16 rounded bg-zinc-200/70 animate-pulse" />
              <div className="h-4 w-full rounded bg-zinc-200/70 animate-pulse" />
              <div className="h-4 w-5/6 rounded bg-zinc-200/70 animate-pulse" />
              <div className="h-3 w-2/3 rounded bg-zinc-200/70 animate-pulse mt-2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
