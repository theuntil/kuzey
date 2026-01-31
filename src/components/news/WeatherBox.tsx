"use client";

import { useEffect, useMemo, useState } from "react";

/* ---------------- TYPES ---------------- */

type Props = {
  city: string;
  miniWidthClassName?: string;
  className?: string;
};

type WeatherState = {
  temp: number;
  code: number;
  isDay: boolean;
  wind: number;
};

/* ---------------- LANG ---------------- */

function getLang(): "tr" | "en" {
  if (typeof window === "undefined") return "tr";
  return window.location.pathname.startsWith("/en") ? "en" : "tr";
}

/* ---------------- HELPERS ---------------- */

function normalizeCity(s: string) {
  return (s ?? "")
    .toLowerCase()
    .trim()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
}

const TR_CITY_COORDS: Record<string, { lat: number; lon: number }> = {
  adana: { lat: 37.0, lon: 35.3213 },
  adiyaman: { lat: 37.7648, lon: 38.2786 },
  afyonkarahisar: { lat: 38.7587, lon: 30.5387 },
  agri: { lat: 39.7191, lon: 43.0503 },
  amasya: { lat: 40.6539, lon: 35.833 },
  ankara: { lat: 39.9334, lon: 32.8597 },
  antalya: { lat: 36.8969, lon: 30.7133 },
  artvin: { lat: 41.1828, lon: 41.8183 },
  aydin: { lat: 37.8444, lon: 27.8458 },
  balikesir: { lat: 39.6484, lon: 27.8826 },
  bilecik: { lat: 40.0567, lon: 30.0665 },
  bingol: { lat: 38.8847, lon: 40.4939 },
  bitlis: { lat: 38.4012, lon: 42.1072 },
  bolu: { lat: 40.7392, lon: 31.6089 },
  burdur: { lat: 37.7203, lon: 30.2908 },
  bursa: { lat: 40.195, lon: 29.060 },
  canakkale: { lat: 40.1553, lon: 26.4142 },
  cankiri: { lat: 40.6013, lon: 33.6134 },
  corum: { lat: 40.5499, lon: 34.9537 },
  denizli: { lat: 37.7765, lon: 29.0864 },
  diyarbakir: { lat: 37.9144, lon: 40.2306 },
  edirne: { lat: 41.6771, lon: 26.5557 },
  elazig: { lat: 38.6743, lon: 39.2232 },
  erzincan: { lat: 39.75, lon: 39.5 },
  erzurum: { lat: 39.9043, lon: 41.2679 },
  eskisehir: { lat: 39.7667, lon: 30.5256 },
  gaziantep: { lat: 37.0662, lon: 37.3833 },
  giresun: { lat: 40.9128, lon: 38.3895 },
  gumushane: { lat: 40.4603, lon: 39.4814 },
  hakkari: { lat: 37.5744, lon: 43.7408 },
  hatay: { lat: 36.2023, lon: 36.1613 },
  isparta: { lat: 37.7648, lon: 30.5566 },
  mersin: { lat: 36.8121, lon: 34.6415 },
  istanbul: { lat: 41.0082, lon: 28.9784 },
  izmir: { lat: 38.4237, lon: 27.1428 },
  kars: { lat: 40.6019, lon: 43.0975 },
  kastamonu: { lat: 41.3887, lon: 33.7827 },
  kayseri: { lat: 38.7312, lon: 35.4787 },
  kirklareli: { lat: 41.7333, lon: 27.2167 },
  kirsehir: { lat: 39.1458, lon: 34.1639 },
  kocaeli: { lat: 40.8533, lon: 29.8815 },
  konya: { lat: 37.8746, lon: 32.4932 },
  kutahya: { lat: 39.4199, lon: 29.9857 },
  malatya: { lat: 38.3552, lon: 38.3095 },
  manisa: { lat: 38.6191, lon: 27.4289 },
  kahramanmaras: { lat: 37.5753, lon: 36.9228 },
  mardin: { lat: 37.3131, lon: 40.735 },
  mugla: { lat: 37.2153, lon: 28.3636 },
  mus: { lat: 38.9462, lon: 41.7539 },
  nevsehir: { lat: 38.6244, lon: 34.7144 },
  nigde: { lat: 37.9667, lon: 34.6833 },
  ordu: { lat: 40.9862, lon: 37.8797 },
  rize: { lat: 41.0255, lon: 40.5177 },
  sakarya: { lat: 40.7569, lon: 30.3783 },
  samsun: { lat: 41.2867, lon: 36.33 },
  siirt: { lat: 37.9333, lon: 41.95 },
  sinop: { lat: 42.0231, lon: 35.1531 },
  sivas: { lat: 39.7477, lon: 37.0179 },
  tekirdag: { lat: 40.978, lon: 27.511 },
  tokat: { lat: 40.3167, lon: 36.55 },
  trabzon: { lat: 41.0015, lon: 39.7178 },
  tunceli: { lat: 39.106, lon: 39.548 },
  sanliurfa: { lat: 37.1674, lon: 38.7955 },
  usak: { lat: 38.6823, lon: 29.4082 },
  van: { lat: 38.4891, lon: 43.4089 },
  yozgat: { lat: 39.82, lon: 34.8044 },
  zonguldak: { lat: 41.4564, lon: 31.7987 },
  aksaray: { lat: 38.3687, lon: 34.037 },
  bayburt: { lat: 40.2552, lon: 40.2249 },
  karaman: { lat: 37.1759, lon: 33.2287 },
  kirikkale: { lat: 39.8468, lon: 33.5153 },
  batman: { lat: 37.8812, lon: 41.1351 },
  sirnak: { lat: 37.4187, lon: 42.4918 },
  bartin: { lat: 41.6344, lon: 32.3375 },
  ardahan: { lat: 41.1105, lon: 42.7022 },
  igdir: { lat: 39.888, lon: 44.0048 },
  yalova: { lat: 40.655, lon: 29.284 },
  karabuk: { lat: 41.2061, lon: 32.6204 },
  kilis: { lat: 36.7184, lon: 37.1212 },
  osmaniye: { lat: 37.0742, lon: 36.2479 },
  duzce: { lat: 40.8438, lon: 31.1565 },
};

/* ---------------- TEXT & ICONS ---------------- */

function weatherText(code: number, temp: number, wind: number, lang: "tr" | "en") {
  if (temp >= 40) return lang === "tr" ? "Aşırı sıcak" : "Extreme heat";
  if (temp <= 0) return lang === "tr" ? "Dondurucu soğuk" : "Freezing cold";
  if (code >= 95) return lang === "tr" ? "Fırtınalı" : "Stormy";
  if (code >= 71 && code <= 77) return lang === "tr" ? "Karlı" : "Snowy";
  if (code >= 45 && code <= 48) return lang === "tr" ? "Sisli" : "Foggy";
  if (code >= 51 && code <= 67) return lang === "tr" ? "Yağmurlu" : "Rainy";
  if (wind >= 35) return lang === "tr" ? "Rüzgarlı" : "Windy";
  if (code >= 1 && code <= 3) return lang === "tr" ? "Bulutlu" : "Cloudy";
  if (code === 0) return lang === "tr" ? "Açık" : "Clear";
  return lang === "tr" ? "Değişken" : "Variable";
}

function resolveIcon(code: number, temp: number, isDay: boolean, wind: number) {
  if (temp >= 40) return "hot";
  if (temp <= 0) return "cold";
  if (code >= 95) return "storm";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 45 && code <= 48) return "fog";
  if (code >= 51 && code <= 67) return isDay ? "rain-day" : "rain-night";
  if (wind >= 35) return "wind-funny";
  if (code >= 1 && code <= 3) return isDay ? "cloudy-day" : "cloudy-night";
  if (code === 0) return isDay ? "clear-day" : "clear-night";
  return "cloudy-day";
}

function resolveMiniIcon(code: number, isDay: boolean) {
  if (code >= 95) return "storm";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 45 && code <= 48) return "fog";
  if (code >= 51 && code <= 67) return isDay ? "rain-day" : "rain-night";
  if (code >= 1 && code <= 3) return isDay ? "cloudy-day" : "cloudy-night";
  if (code === 0) return isDay ? "clear-day" : "clear-night";
  return "cloudy-day";
}

/* ---------------- COMPONENT ---------------- */

export default function WeatherWidget({
  city,
  miniWidthClassName = "max-w-[160px] shrink-0",
  className = "",
}: Props) {
  const lang = getLang();

  // ✅ TEK KAYNAK
  const displayCity = city?.trim() ? city : "İstanbul";
  const cityKey = normalizeCity(displayCity);

  const [data, setData] = useState<WeatherState | null>(null);
  const [icon, setIcon] = useState("loading");
  const [miniIcon, setMiniIcon] = useState("loading");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        let lat: number | null = TR_CITY_COORDS[cityKey]?.lat ?? null;
        let lon: number | null = TR_CITY_COORDS[cityKey]?.lon ?? null;

        if (lat === null || lon === null) {
          const queries = [`${cityKey}, turkey`, `${cityKey}, tr`, cityKey];
          for (const q of queries) {
            const r = await fetch(
              `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1`
            ).then((r) => r.json());
            if (r.results?.[0]) {
              lat = r.results[0].latitude;
              lon = r.results[0].longitude;
              break;
            }
          }
        }

        if (lat === null || lon === null) throw new Error("geo");

        const w = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        ).then((r) => r.json());

        if (!w.current_weather) throw new Error("weather");
        if (!alive) return;

        setData({
          temp: w.current_weather.temperature,
          code: w.current_weather.weathercode,
          isDay: w.current_weather.is_day === 1,
          wind: w.current_weather.windspeed,
        });

        setIcon(resolveIcon(w.current_weather.weathercode, w.current_weather.temperature, w.current_weather.is_day === 1, w.current_weather.windspeed));
        setMiniIcon(resolveMiniIcon(w.current_weather.weathercode, w.current_weather.is_day === 1));

        requestAnimationFrame(() => setReady(true));
      } catch {
        if (!alive) return;
        setData(null);
        setReady(true);
      }
    }

    setReady(false);
    load();
    return () => {
      alive = false;
    };
  }, [cityKey, lang]);

  const label = useMemo(() => {
    if (!data) return "";
    return weatherText(data.code, data.temp, data.wind, lang);
  }, [data, lang]);

  return (
    <div className={className}>
      {/* MOBILE */}
      <div
        className={`lg:hidden ${miniWidthClassName} h-9 bg-white rounded-full shadow-sm px-4 flex items-center gap-1.5 transition-all duration-500
        ${ready ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"}`}
      >
        <div className="w-5 h-5 shrink-0 flex items-center justify-center">
          {data ? <img src={`/weather/${miniIcon}.apng`} alt="" className="w-5 h-5" /> : <div className="w-5 h-5 rounded-full bg-neutral-200 animate-pulse" />}
        </div>

        <div className="text-[11px] font-medium text-neutral-600 truncate">
          {data ? displayCity : <div className="w-10 h-3 bg-neutral-200 rounded animate-pulse" />}
        </div>

        <div className="ml-auto text-sm font-bold text-neutral-900 tabular-nums">
          {data ? `${Math.round(data.temp)}°` : <div className="w-5 h-4 bg-neutral-200 rounded animate-pulse" />}
        </div>
      </div>

      {/* DESKTOP */}
      <section className="hidden lg:block bg-white rounded-3xl shadow-sm p-5">
        <div className="flex items-center min-h-[130px]">
          <div className="w-24 h-24 flex items-center justify-center shrink-0">
            <img
              src={`/weather/${icon}.apng`}
              alt=""
              className={`w-20 h-20 transition-all duration-500 ${ready ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
            />
          </div>

          <div className={`flex-1 transition-all duration-500 ${ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}>
            {data && (
              <>
                <p className="text-xs font-medium text-neutral-500">{displayCity}</p>
                <p className="text-4xl font-extrabold leading-none tabular-nums">{Math.round(data.temp)}°</p>
                <p className="text-sm font-semibold text-neutral-700">{label}</p>
                <p className="text-[11px] text-neutral-400">
                  {lang === "tr" ? `Rüzgar • ${Math.round(data.wind)} km/sa` : `Wind • ${Math.round(data.wind)} km/h`}
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
