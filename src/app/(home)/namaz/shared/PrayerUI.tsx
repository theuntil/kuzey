"use client";
import { useAutoPageView } from "@/lib/analytics/useAutoPageView";

import { useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  ChevronDown,
  Clock,
  MoonStar,
  Sun,
  Sunrise,
  Sunset,
  CloudSun,
} from "lucide-react";
import type { PrayerPayload } from "./data";

type CityOption = { slug: string; label: string };

const PRAYERS = [
  { key: "Fajr", label: "İmsak", icon: MoonStar, chip: "bg-indigo-50 text-indigo-700 ring-indigo-100" },
  { key: "Dhuhr", label: "Öğle", icon: Sun, chip: "bg-sky-50 text-sky-700 ring-sky-100" },
  { key: "Asr", label: "İkindi", icon: CloudSun, chip: "bg-emerald-50 text-emerald-700 ring-emerald-100" },
  { key: "Maghrib", label: "Akşam", icon: Sunset, chip: "bg-orange-50 text-orange-700 ring-orange-100" },
  { key: "Isha", label: "Yatsı", icon: MoonStar, chip: "bg-violet-50 text-violet-700 ring-violet-100" },
] as const;

type PrayerKey = (typeof PRAYERS)[number]["key"];

function pad2(n: number) {
  return String(n).padStart(2, "0");
}
function parseHHMM(raw: string) {
  const m = raw.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const h = Number(m[1]);
  const mm = Number(m[2]);
  if (!Number.isFinite(h) || !Number.isFinite(mm)) return null;
  return { h, m: mm };
}
function atLocalDate(base: Date, h: number, m: number) {
  const t = new Date(base);
  t.setHours(h, m, 0, 0);
  return t;
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

function computeNext(times: PrayerPayload["times"], now: Date) {
  const today = new Date(now);

  for (const p of PRAYERS) {
    const parsed = parseHHMM(times[p.key as PrayerKey]);
    if (!parsed) continue;
    const t = atLocalDate(today, parsed.h, parsed.m);
    if (t > now) {
      const diffMin = Math.max(0, Math.ceil((t.getTime() - now.getTime()) / 60000));
      return { nextKey: p.key, nextLabel: p.label, nextTime: t, diffMin, isTomorrow: false };
    }
  }

  const first = PRAYERS[0];
  const parsed = parseHHMM(times[first.key as PrayerKey]);
  if (!parsed) return null;
  const t = atLocalDate(today, parsed.h, parsed.m);
  t.setDate(t.getDate() + 1);
  const diffMin = Math.max(0, Math.ceil((t.getTime() - now.getTime()) / 60000));
  return { nextKey: first.key, nextLabel: first.label, nextTime: t, diffMin, isTomorrow: true };
}

export default function PrayerUI({
  citySlug,
  cityLabel,
  payload,
  allCities,
}: {
  citySlug: string;
  cityLabel: string;
  payload: PrayerPayload;
  allCities: CityOption[];
}) {
   useAutoPageView(); 
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // kalan süre tick
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((x) => x + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const next = useMemo(() => {
    void tick;
    return computeNext(payload.times, new Date());
  }, [payload.times, tick]);

  // soft mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const todayStr = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString("tr-TR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  const sunrise = payload.times.Sunrise;
  const sunset = payload.times.Sunset;
  const hijriText =
    payload.hijri?.date
      ? payload.hijri.month
        ? `${payload.hijri.date} (${payload.hijri.month})`
        : payload.hijri.date
      : "-";

  return (
    <main className="min-h-dvh">
      <div
        className={[
          "mx-auto w-full max-w-7xl px-3 py-6",
          "transition-all duration-500 motion-reduce:transition-none",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        ].join(" ")}
      >
        {/* Top */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Namaz Vakitleri
            </h1>
            <div className="mt-2 flex items-center gap-2 text-sm text-zinc-500">
              <CalendarDays className="h-4 w-4" />
              <span className="tabular-nums">{todayStr}</span>
            </div>
          </div>

          <div className="relative w-full sm:w-[260px]">
            <select
              value={citySlug}
              onChange={(e) => {
                const slug = e.target.value;
                const target = slug === "istanbul" ? "/namaz" : `/namaz/${slug}`;
                if (pathname === target) return;
                startTransition(() => router.push(target));
              }}
              className="h-11 w-full appearance-none rounded-xl border border-zinc-200 bg-white px-4 pr-10 text-sm font-medium text-zinc-900 shadow-sm outline-none transition focus:border-zinc-300"
            >
              {allCities.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-zinc-500" />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          {/* Big */}
          <section className="lg:col-span-7">
            <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-zinc-500">Seçili şehir</p>
                  <p className="mt-1 text-xl font-semibold text-zinc-900">{cityLabel}</p>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-zinc-900 text-white">
                  <Clock className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-zinc-50 p-4 ring-1 ring-zinc-200 sm:p-5">
                <p className="text-sm font-medium text-zinc-600">Sıradaki vakit</p>

                <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-2xl font-semibold text-zinc-900">
                      {next?.nextLabel ?? "-"}
                      {next?.isTomorrow ? (
                        <span className="ml-2 rounded-full bg-zinc-900 px-2 py-0.5 align-middle text-xs font-medium text-white">
                          yarın
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-1 text-sm text-zinc-600">
                      Saat:{" "}
                      <span className="font-semibold tabular-nums text-zinc-900">
                        {next ? formatHHMM(next.nextTime) : "--:--"}
                      </span>
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium text-zinc-600">Kalan</p>
                    <p className="mt-1 text-3xl font-semibold tabular-nums text-zinc-900">
                      {next ? formatRemainingTR(next.diffMin) : "-"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <Stat icon={Sunrise} label="Gün doğumu" value={sunrise || "-"} />
                  <Stat icon={Sunset} label="Gün batımı" value={sunset || "-"} />
                  <Stat icon={MoonStar} label="Hicrî" value={hijriText} />
                </div>

                
              </div>
            </div>
          </section>

          {/* List */}
          <section className="lg:col-span-5">
            <div className="rounded-3xl  p-5  sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-zinc-900">Vakit Saatleri</h2>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                  {cityLabel}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {PRAYERS.map((p) => {
                  const Icon = p.icon;
                  const isNext = next?.nextKey === p.key && !next?.isTomorrow;
                  const t = payload.times[p.key as PrayerKey];

                  return (
                    <div
                      key={p.key}
                      className={[
                        "flex items-center justify-between rounded-2xl border p-4 transition",
                        isNext
                          ? "border-zinc-900/15 ring-1 ring-zinc-900/10 bg-zinc-200"
                          : "border-zinc-200 bg-white hover:border-zinc-300",
                      ].join(" ")}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={[
                            "grid h-11 w-11 place-items-center rounded-2xl ring-1",
                            isNext
                              ? "bg-zinc-900 text-white ring-zinc-900/20"
                              : `${p.chip} ring-1`,
                          ].join(" ")}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-zinc-900">
                            {p.label}
                            {isNext ? (
                              <span className="ml-2 rounded-full bg-zinc-900 px-3 py-1 text-[10px] font-medium text-white">
                                Sıradaki Vakit
                              </span>
                            ) : null}
                          </p>
                          <p className="text-xs text-zinc-500">{p.key}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-semibold tabular-nums text-zinc-900">
                          {t || "--:--"}
                        </p>
                        <p className="text-xs text-zinc-500">TR</p>
                      </div>
                    </div>
                  );
                })}
              </div>

             
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-3 ring-1 ring-zinc-200">
      <div className="flex items-center gap-2 text-xs font-medium text-zinc-600">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </div>
      <div className="mt-1 text-sm font-semibold tabular-nums text-zinc-900">{value}</div>
    </div>
  );
}
