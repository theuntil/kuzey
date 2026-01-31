import type {
  OnThisDayResponse,
  OnThisDayEvent,
  OnThisDayPage,
  WikiSummary,
} from "./types";

const USER_AGENT = "kuzeybati-haber/1.0 (onthisday)";

/**
 * Wikimedia OnThisDay feed (TR)
 * - Server-side fetch
 * - Cache: revalidate (prod hızlı)
 */
export async function fetchOnThisDayTR({
  month,
  day,
  limit = 24,
}: {
  month: string;
  day: string;
  limit?: number;
}) {
  const url = `https://api.wikimedia.org/feed/v1/wikipedia/tr/onthisday/events/${month}/${day}`;

  const res = await fetch(url, {
    next: { revalidate: 60 * 30 }, // 30 dk
    headers: {
      accept: "application/json",
      "user-agent": USER_AGENT,
    },
  });

  if (!res.ok) return { events: [] as OnThisDayEvent[] };

  const json = (await res.json()) as OnThisDayResponse;
  const events = Array.isArray(json?.events) ? json.events : [];

  const cleaned: OnThisDayEvent[] = events.slice(0, limit).map((e) => ({
    text: e.text,
    year: e.year,
    pages: Array.isArray(e.pages)
      ? e.pages.map((p: OnThisDayPage) => ({
          title: p.title,
          normalizedtitle: p.normalizedtitle,
          displaytitle: p.displaytitle,
          thumbnail: p.thumbnail,
          content_urls: p.content_urls,
          extract: p.extract,
          extract_html: p.extract_html,
        }))
      : [],
  }));

  return { events: cleaned };
}

/**
 * Wikipedia REST Summary (TR)
 * - Detay sayfası için güvenli ve hızlı
 */
export async function fetchWikiSummaryTR(title: string): Promise<WikiSummary | null> {
  const safe = encodeURIComponent((title ?? "").trim().replaceAll(" ", "_"));
  const url = `https://tr.wikipedia.org/api/rest_v1/page/summary/${safe}`;

  const res = await fetch(url, {
    next: { revalidate: 60 * 60 }, // 1 saat
    headers: {
      accept: "application/json",
      "user-agent": USER_AGENT,
    },
  });

  if (!res.ok) return null;
  return (await res.json()) as WikiSummary;
}
