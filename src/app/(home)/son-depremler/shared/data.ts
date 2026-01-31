import { unstable_cache } from "next/cache";
import type { EarthquakeItem } from "./types";

type ApiResponse = {
  status?: boolean;
  result?: Array<{
    earthquake_id?: string;
    title?: string;
    mag?: number | string;
    depth?: number | string;
    geojson?: { coordinates?: [number, number] }; // [lon, lat]
    date_time?: string;
  }>;
};

function num(v: unknown): number | null {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) ? n : null;
}

async function fetchKandilli(limit: number): Promise<EarthquakeItem[] | null> {
  const url = `https://api.orhanaydogdu.com.tr/deprem/kandilli/live?limit=${encodeURIComponent(
    String(limit)
  )}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;

  const json = (await res.json()) as ApiResponse;
  const arr = json?.result;
  if (!Array.isArray(arr) || arr.length === 0) return null;

  const out: EarthquakeItem[] = [];

  for (const x of arr) {
    const id = x.earthquake_id ?? "";
    const title = x.title ?? "";
    const mag = num(x.mag) ?? 0;
    const depthKm = num(x.depth);
    const timeISO = x.date_time ?? "";

    const coords = x.geojson?.coordinates;
    const lon = coords?.[0];
    const lat = coords?.[1];

    if (!id || !title || !timeISO) continue;
    if (!Number.isFinite(lon ?? NaN) || !Number.isFinite(lat ?? NaN)) continue;

    out.push({
      id,
      title,
      mag,
      depthKm,
      timeISO,
      lat: lat as number,
      lon: lon as number,
    });
  }

  return out.length ? out : null;
}

const getCached = unstable_cache(
  async (limit: number) => fetchKandilli(limit),
  ["eq-kandilli-v2"],
  { revalidate: 60, tags: ["earthquakes"] }
);

export async function getLatestEarthquakes(limit = 80) {
  return getCached(limit);
}
