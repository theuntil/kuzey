"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

type Props = {
  city: string;
  lang?: "tr" | "en";
};

type PrayerTimes = {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};

const CITY_MAP: Record<string, string> = {
  ADANA: "Adana",
  ADIYAMAN: "Adiyaman",
  AFYONKARAHISAR: "Afyonkarahisar",
  AFYONKARAHİSAR: "Afyonkarahisar",
  AGRI: "Agri",
  AĞRI: "Agri",
  AMASYA: "Amasya",
  ANKARA: "Ankara",
  ANTALYA: "Antalya",
  ARTVIN: "Artvin",
  ARTVİN: "Artvin",
  AYDIN: "Aydin",
  BALIKESIR: "Balikesir",
  BALIKESİR: "Balikesir",
  BILECIK: "Bilecik",
  BİLECİK: "Bilecik",
  BINGOL: "Bingol",
  BİNGÖL: "Bingol",
  BITLIS: "Bitlis",
  BİTLİS: "Bitlis",
  BOLU: "Bolu",
  BURDUR: "Burdur",
  BURSA: "Bursa",
  CANAKKALE: "Canakkale",
  ÇANAKKALE: "Canakkale",
  CANKIRI: "Cankiri",
  ÇANKIRI: "Cankiri",
  CORUM: "Corum",
  ÇORUM: "Corum",
  DENIZLI: "Denizli",
  DENİZLİ: "Denizli",
  DIYARBAKIR: "Diyarbakir",
  DİYARBAKIR: "Diyarbakir",
  EDIRNE: "Edirne",
  EDİRNE: "Edirne",
  ELAZIG: "Elazig",
  ELAZIĞ: "Elazig",
  ERZINCAN: "Erzincan",
  ERZURUM: "Erzurum",
  ESKISEHIR: "Eskisehir",
  ESKİŞEHİR: "Eskisehir",
  GAZIANTEP: "Gaziantep",
  GAZİANTEP: "Gaziantep",
  GIRESUN: "Giresun",
  GİRESUN: "Giresun",
  GUMUSHANE: "Gumushane",
  GÜMÜŞHANE: "Gumushane",
  HAKKARI: "Hakkari",
  HAKKARİ: "Hakkari",
  HATAY: "Hatay",
  ISPARTA: "Isparta",
  MERSIN: "Mersin",
  MERSİN: "Mersin",
  ISTANBUL: "Istanbul",
  İSTANBUL: "Istanbul",
  IZMIR: "Izmir",
  İZMİR: "Izmir",
  izmir:"izmir",
  ızmır:"izmir",
  KARS: "Kars",
  KASTAMONU: "Kastamonu",
  KAYSERI: "Kayseri",
  KAYSERİ: "Kayseri",
  KIRKLARELI: "Kirklareli",
  KIRKLARELİ: "Kirklareli",
  KIRSEHIR: "Kirsehir",
  KIRŞEHİR: "Kirsehir",
  KOCAELI: "Kocaeli",
  KOCAELİ: "Kocaeli",
  KONYA: "Konya",
  KUTAHYA: "Kutahya",
  KÜTAHYA: "Kutahya",
  MALATYA: "Malatya",
  MANISA: "Manisa",
  MANİSA: "Manisa",
  KAHRAMANMARAS: "Kahramanmaras",
  KAHRAMANMARAŞ: "Kahramanmaras",
  MARDIN: "Mardin",
  MARDİN: "Mardin",
  MUGLA: "Mugla",
  MUĞLA: "Mugla",
  MUS: "Mus",
  MUŞ: "Mus",
  NEVSEHIR: "Nevsehir",
  NEVŞEHİR: "Nevsehir",
  NIGDE: "Nigde",
  NİĞDE: "Nigde",
  ORDU: "Ordu",
  RIZE: "Rize",
  RİZE: "Rize",
  SAKARYA: "Sakarya",
  SAMSUN: "Samsun",
  SIIRT: "Siirt",
  SİİRT: "Siirt",
  SINOP: "Sinop",
  SIVAS: "Sivas",
  TEKIRDAG: "Tekirdag",
  TEKİRDAĞ: "Tekirdag",
  TOKAT: "Tokat",
  TRABZON: "Trabzon",
  TUNCELI: "Tunceli",
  TUNCELİ: "Tunceli",
  SANLIURFA: "Sanliurfa",
  ŞANLIURFA: "Sanliurfa",
  USAK: "Usak",
  UŞAK: "Usak",
  VAN: "Van",
  YOZGAT: "Yozgat",
  ZONGULDAK: "Zonguldak",
  AKSARAY: "Aksaray",
  BAYBURT: "Bayburt",
  KARAMAN: "Karaman",
  KIRIKKALE: "Kirikkale",
  KİRİKKALE:"Kirikkale",
  BATMAN: "Batman",
  SIRNAK: "Sirnak",
  ŞIRNAK: "Sirnak",
  BARTIN: "Bartin",
  ARDAHAN: "Ardahan",
  IGDIR: "Igdir",
  IĞDIR: "Igdir",
  YALOVA: "Yalova",
  KARABUK: "Karabuk",
  KARABÜK: "Karabuk",
  KILIS: "Kilis",
  KİLİS: "Kilis",
  OSMANIYE: "Osmaniye",
  OSMANİYE: "Osmaniye",
  DUZCE: "Duzce",
  DÜZCE: "Duzce",
};


const PRAYERS = [
  { key: "Fajr", tr: "İmsak", trAcc: "İmsağa", en: "Fajr", enAcc: "Fajr", icon: "/namaz/ogle.apng" },
  { key: "Dhuhr", tr: "Öğle", trAcc: "Öğleye", en: "Dhuhr", enAcc: "Dhuhr", icon: "/namaz/ogle.apng" },
  { key: "Asr", tr: "İkindi", trAcc: "İkindiye", en: "Asr", enAcc: "Asr", icon: "/namaz/ikindi.apng" },
  { key: "Maghrib", tr: "Akşam", trAcc: "Akşama", en: "Maghrib", enAcc: "Maghrib", icon: "/namaz/aksam.apng" },
  { key: "Isha", tr: "Yatsı", trAcc: "Yatsıya", en: "Isha", enAcc: "Isha", icon: "/namaz/yatsi.apng" },
] as const;

type PrayerKey = (typeof PRAYERS)[number]["key"];

function getLangFromPath(pathname: string | null): "tr" | "en" {
  if (!pathname) return "tr";
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "tr";
}

function ymdLocal() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function parseHHMM(raw: string) {
  const [h, m] = raw.split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  return { h, m };
}

function atLocalDate(base: Date, h: number, m: number) {
  const t = new Date(base);
  t.setHours(h, m, 0, 0);
  return t;
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatHHMM(d: Date) {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function formatRemainingTR(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h <= 0) return `${m} dakika`;
  if (m === 0) return `${h} saat`;
  return `${h} saat ${m} dakika`;
}

function formatRemainingEN(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h <= 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}

export default function PrayerTimesBox({ city, lang: langProp }: Props) {
  const pathname = usePathname();
  const lang = langProp ?? getLangFromPath(pathname);

  const [data, setData] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);
  const [ready, setReady] = useState(false);

  const normalizedCity = useMemo(() => {
    const key = (city ?? "").trim().toUpperCase();
    return CITY_MAP[key] ?? "Istanbul";
  }, [city]);

  useEffect(() => {
    const id = setInterval(() => setTick((x) => x + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const cacheKey = `prayer-${normalizedCity}-${ymdLocal()}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      setData(JSON.parse(cached));
      setLoading(false);
      requestAnimationFrame(() => setReady(true));
      return;
    }

    fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(
        normalizedCity
      )}&country=Turkey&method=13`,
      { cache: "no-store" }
    )
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        const t = res?.data?.timings;
        if (!t) return;

        const payload: PrayerTimes = {
          Fajr: t.Fajr,
          Dhuhr: t.Dhuhr,
          Asr: t.Asr,
          Maghrib: t.Maghrib,
          Isha: t.Isha,
        };

        localStorage.setItem(cacheKey, JSON.stringify(payload));
        setData(payload);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
          requestAnimationFrame(() => setReady(true));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [normalizedCity]);

  const computed = useMemo(() => {
    if (!data) return null;

    const now = new Date();
    const today = new Date(now);

    let next = null;

    for (const p of PRAYERS) {
      const parsed = parseHHMM(data[p.key]);
      if (!parsed) continue;
      const t = atLocalDate(today, parsed.h, parsed.m);
      if (t > now) {
        next = {
          ...p,
          time: t,
          timeStr: formatHHMM(t),
        };
        break;
      }
    }

    if (!next) {
      const parsed = parseHHMM(data.Fajr);
      if (!parsed) return null;
      const t = atLocalDate(today, parsed.h, parsed.m);
      t.setDate(t.getDate() + 1);
      next = {
        ...PRAYERS[0],
        time: t,
        timeStr: formatHHMM(t),
      };
    }

    const diffMin = Math.max(0, Math.floor((next.time.getTime() - Date.now()) / 60000));

    return {
      next,
      cityText: normalizedCity,
      title:
        lang === "en"
          ? `${next.enAcc} remaining`
          : `${next.trAcc} kalan vakit`,
      remaining:
        lang === "en"
          ? formatRemainingEN(diffMin)
          : formatRemainingTR(diffMin),
    };
  }, [data, lang, tick, normalizedCity]);

  /* ---------------- MOBILE MINI BAR ---------------- */

  const MobileMini = (
    <div
      className={`
        lg:hidden
        w-[33%]
        min-w-[140px]
        max-w-[150px]
        h-9
        bg-white
        rounded-full
        shadow-sm
        px-4
        flex
        items-center
        gap-1.5
        transition-all
        duration-500
        ${ready ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"}
      `}
    >
      <div className="w-5 h-5 shrink-0">
        {data ? (
          <img src="/namaz/icon.apng" className="w-5 h-5" alt="" />
        ) : (
          <div className="w-5 h-5 bg-neutral-200 rounded-full animate-pulse" />
        )}
      </div>

      <div className="text-[11px] font-medium text-neutral-600 truncate">
        {data ? normalizedCity : <div className="w-10 h-3 bg-neutral-200 rounded animate-pulse" />}
      </div>

      <div className="ml-auto text-sm font-bold tabular-nums text-neutral-900">
        {computed ? computed.next.timeStr : <div className="w-6 h-4 bg-neutral-200 rounded animate-pulse" />}
      </div>
    </div>
  );

  if (loading) {
    return (
      <>
        {MobileMini}
        <div className="hidden lg:block rounded-3xl p-5 bg-white  shadow-sm animate-soft-in">
          <div className="h-24 bg-neutral-200 rounded-xl animate-pulse" />
        </div>
      </>
    );
  }

  if (!computed) return null;

  const nextLabel = lang === "en" ? computed.next.en : computed.next.tr;

  return (
    <>
      {MobileMini}

      <div className="hidden lg:block rounded-3xl p-6 bg-white shadow-sm animate-soft-in">
        <div className="flex items-start justify-between gap-3">
          <div className="text-lg font-extrabold truncate">{computed.cityText}</div>
          <img src={computed.next.icon} className="w-14 h-14" alt="" />
        </div>

        <div className="mt-2 text-sm text-neutral-600">{computed.title}</div>
        <div className="mt-1 text-xl font-extrabold">{computed.remaining}</div>

        <div className="mt-3 flex justify-between bg-neutral-50 rounded-2xl px-4 py-3">
          <div className="text-xs font-semibold">{nextLabel}</div>
          <div className="text-xs font-bold">{computed.next.timeStr}</div>
        </div>
      </div>
    </>
  );
}
