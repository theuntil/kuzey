export function stripHtml(s: string) {
  return (s ?? "").replace(/<[^>]*>/g, "").trim();
}

export function decodeWikiTitle(raw: string) {
  try {
    return decodeURIComponent(raw ?? "").replace(/_/g, " ").trim();
  } catch {
    return (raw ?? "").replace(/_/g, " ").trim();
  }
}

export function encodeWikiTitle(title: string) {
  // summary endpoint için url-safe
  return encodeURIComponent((title ?? "").trim().replace(/ /g, "_"));
}

export function dayMonthNow() {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return { day, month, date: d };
}

export function formatDateLabelTR(date: Date) {
  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function onThisDayUrlTR(month: string, day: string) {
  // TR feed
  return `https://api.wikimedia.org/feed/v1/wikipedia/tr/onthisday/events/${month}/${day}`;
}

export function wikiSummaryUrlTR(title: string) {
  return `https://tr.wikipedia.org/api/rest_v1/page/summary/${encodeWikiTitle(title)}`;
}

// event.pages[0] için güvenli seçim (varsa thumbnail'lıyı tercih eder)
export function pickBestPage(pages: any[] | undefined | null) {
  const arr = Array.isArray(pages) ? pages : [];
  if (arr.length === 0) return null;
  const withImg = arr.find((p) => p?.thumbnail?.source);
  return withImg ?? arr[0] ?? null;
}
