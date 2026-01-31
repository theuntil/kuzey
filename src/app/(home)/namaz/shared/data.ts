import { unstable_cache } from "next/cache";

export type PrayerTimes = {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Sunrise: string;
  Sunset: string;
};

export type HijriInfo = {
  date?: string;
  weekday?: string;
  month?: string;
};

export type PrayerPayload = {
  times: PrayerTimes;
  hijri: HijriInfo | null;
};

type AladhanResponse = {
  data?: {
    timings?: Record<string, string>;
    date?: {
      hijri?: {
        date?: string;
        weekday?: { en?: string };
        month?: { en?: string };
      };
    };
  };
};

function pickHHMM(v: string | undefined) {
  if (!v) return null;
  const m = v.match(/^(\d{1,2}):(\d{2})/);
  if (!m) return null;
  const hh = String(Number(m[1])).padStart(2, "0");
  const mm = m[2];
  return `${hh}:${mm}`;
}

function ymdTR() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${day}-${m}-${y}`; // Aladhan "DD-MM-YYYY" kullanır
}

/**
 * Şehir + gün bazlı cache.
 * - revalidate: 30 dk
 * - key: ["prayer", cityTR, date]
 */
const fetchPrayerPayload = unstable_cache(
  async (cityTR: string, dateDDMMYYYY: string): Promise<PrayerPayload | null> => {
    // Aladhan: /timingsByCity/{date}
    const url = `https://api.aladhan.com/v1/timingsByCity/${dateDDMMYYYY}?city=${encodeURIComponent(
      cityTR
    )}&country=Turkey&method=13`;

    try {
      const res = await fetch(url, {
        // burada artık Next fetch cache yerine unstable_cache cache kullanıyoruz
        cache: "no-store",
        headers: { accept: "application/json" },
      });

      if (!res.ok) return null;

      const json = (await res.json()) as AladhanResponse;
      const t = json?.data?.timings;
      if (!t) return null;

      const times: PrayerTimes = {
        Fajr: pickHHMM(t.Fajr) ?? "",
        Dhuhr: pickHHMM(t.Dhuhr) ?? "",
        Asr: pickHHMM(t.Asr) ?? "",
        Maghrib: pickHHMM(t.Maghrib) ?? "",
        Isha: pickHHMM(t.Isha) ?? "",
        Sunrise: pickHHMM(t.Sunrise) ?? "",
        Sunset: pickHHMM(t.Sunset) ?? "",
      };

      if (
        !times.Fajr ||
        !times.Dhuhr ||
        !times.Asr ||
        !times.Maghrib ||
        !times.Isha ||
        !times.Sunrise ||
        !times.Sunset
      ) {
        return null;
      }

      const hijriRaw = json?.data?.date?.hijri;
      const hijri: HijriInfo | null = hijriRaw
        ? {
            date: hijriRaw.date,
            weekday: hijriRaw.weekday?.en,
            month: hijriRaw.month?.en,
          }
        : null;

      return { times, hijri };
    } catch {
      return null;
    }
  },
  // keyParts template (not used directly here because we pass arguments; next will key by args)
  ["prayer-payload"],
  {
    revalidate: 60 * 30,
    tags: ["prayer-times"],
  }
);

export async function getPrayerPayloadByCityTR(cityTR: string): Promise<PrayerPayload | null> {
  // arg’larla cache key ayrışır: cityTR + date
  return fetchPrayerPayload(cityTR, ymdTR());
}
