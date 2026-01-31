import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, ExternalLink, History } from "lucide-react";
import type { WikiSummary } from "./types";
import { wikiSummaryUrlTR, stripHtml } from "./utils";

async function fetchSummaryTR(title: string): Promise<WikiSummary | null> {
  const url = wikiSummaryUrlTR(title);

  const res = await fetch(url, {
    next: { revalidate: 60 * 60 },
    headers: { accept: "application/json" },
  });

  if (!res.ok) return null;

  const json = (await res.json()) as WikiSummary;
  if (!json?.title) return null;

  return json;
}

export default async function TodayInHistoryDetail({
  title,
  year,
  eventText,
}: {
  title: string;
  year?: string;
  eventText?: string;
}) {
  const data = await fetchSummaryTR(title);
  if (!data) notFound();

  const displayTitle = stripHtml(data.title);
  const extract = stripHtml(data.extract ?? "");
  const image = data.thumbnail?.source ?? null;
  const pageUrl = data.content_urls?.desktop?.page ?? null;

  return (
    <main className="min-h-dvh ">
      <div className="mx-auto w-full max-w-4xl px-4 py-6">
        <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <div className="relative aspect-[16/9] w-full bg-zinc-100">
            {image ? (
              <Image
                src={image}
                alt={displayTitle}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-sm text-zinc-500">
                Görsel yok
              </div>
            )}
          </div>

          <div className="p-6">
            {/* ✅ OLAY KARTI */}
            {(eventText || year) && (
              <div className="mb-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-zinc-700">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 ring-1 ring-zinc-200">
                    <History className="h-4 w-4" />
                    Bugün Tarihte
                  </span>

                  {year ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 ring-1 ring-zinc-200">
                      <CalendarDays className="h-4 w-4" />
                      {year}
                    </span>
                  ) : null}
                </div>

                {eventText ? (
                  <p className="mt-3 text-sm font-semibold leading-relaxed text-zinc-900">
                    {eventText}
                  </p>
                ) : null}
              </div>
            )}

            {/* Wikipedia başlık/özet */}
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              {displayTitle}
            </h1>

            {extract ? (
              <p className="mt-4 text-sm leading-relaxed text-zinc-700">
                {extract}
              </p>
            ) : (
              <p className="mt-4 text-sm text-zinc-600">
                Bu başlık için özet bulunamadı.
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="/tarihte-bugun"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-300"
              >
                Geri dön
              </Link>

              {pageUrl ? (
                <a
                  href={pageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
                >
                  Wikipedia’da aç
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          </div>
        </section>

        <p className="mt-6 text-xs text-zinc-500">
          Kaynak: Wikimedia OnThisDay + Wikipedia REST Summary (TR)
        </p>
      </div>
    </main>
  );
}
