"use client";
import { useAutoPageView } from "@/lib/analytics/useAutoPageView";

import Image from "next/image";
import { useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, ChevronDown, Wind, Droplets } from "lucide-react";
import type { WeatherPayload } from "./data";
import { iconForWeatherCode, labelForWeatherCodeTR } from "./icons";

type CityOption = { slug: string; label: string };

function fmtDayTR(dateISO: string) {
  const d = new Date(dateISO + "T12:00:00");
  return d.toLocaleDateString("tr-TR", { weekday: "short", day: "2-digit", month: "short" });
}

export default function WeatherUI({
  citySlug,
  cityLabel,
  payload,
  allCities,
}: {
  citySlug: string;
  cityLabel: string;
  payload: WeatherPayload;
  allCities: CityOption[];
}) {
    useAutoPageView(); 
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const today = payload.daily[0];
  const nextDays = payload.daily.slice(1, 6);

  const todayLabel = useMemo(() => {
    return new Date().toLocaleDateString("tr-TR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  const title = labelForWeatherCodeTR(today.weathercode);
  const iconSrc = iconForWeatherCode(today.weathercode);

  return (
    <main className="min-h-dvh">
      <div
        className={[
          "mx-auto w-full max-w-6xl px-4 py-6",
          "transition-all duration-500 motion-reduce:transition-none",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        ].join(" ")}
      >
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Hava Durumu</h1>
            <div className="mt-2 flex items-center gap-2 text-sm text-zinc-500">
              <CalendarDays className="h-4 w-4" />
              <span>{todayLabel}</span>
            </div>
          </div>

          <div className="relative w-full sm:w-[260px]">
            <select
              value={citySlug}
              onChange={(e) => {
                const slug = e.target.value;
                const target = slug === "istanbul" ? "/hava-durumu" : `/hava-durumu/${slug}`;
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

        {/* Layout */}
        <div className="grid gap-4 lg:grid-cols-12">
          {/* Big */}
          <section className="lg:col-span-7">
            <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-zinc-500">Seçili şehir</p>
                  <p className="mt-1 text-xl font-semibold text-zinc-900">{cityLabel}</p>
                  <p className="mt-2 text-sm text-zinc-600">{title}</p>
                </div>

                <div className="grid h-20 w-20 place-items-center rounded-2xl">
                  <Image src={iconSrc} alt={title} width={110} height={110} />
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-zinc-50 p-4 ring-1 ring-zinc-200 sm:p-5">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-zinc-600">Bugün</p>
                    <p className="mt-1 text-4xl font-semibold tabular-nums text-zinc-900">
                      {Math.round(payload.current.temperature ?? today.tempMax)}°C
                    </p>
                    <p className="mt-1 text-sm text-zinc-600">
                      Min {Math.round(today.tempMin)}° / Max {Math.round(today.tempMax)}°
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 ring-1 ring-zinc-200">
                      <Wind className="h-4 w-4 text-zinc-600" />
                      <span className="text-sm font-semibold tabular-nums text-zinc-900">
                        {payload.current.windspeed != null ? Math.round(payload.current.windspeed) : "-"} km/sa
                      </span>
                    </div>
                    <div className="mt-2 inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 ring-1 ring-zinc-200">
                      <Droplets className="h-4 w-4 text-zinc-600" />
                      <span className="text-sm font-semibold tabular-nums text-zinc-900">
                        {today.precipProbMax != null ? `${Math.round(today.precipProbMax)}%` : "-"}
                      </span>
                    </div>
                  </div>
                </div>

              
              </div>
            </div>
          </section>

          {/* 5-day */}
          <section className="lg:col-span-5">
            <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-zinc-900">Sonraki 5 Gün</h2>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                  {cityLabel}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {nextDays.map((d) => {
                  const text = labelForWeatherCodeTR(d.weathercode);
                  const icon = iconForWeatherCode(d.weathercode);

                  return (
                    <div
                      key={d.date}
                      className="flex items-center justify-between rounded-2xl border border-zinc-200 p-4 hover:border-zinc-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-zinc-50 ring-1 ring-zinc-200">
                          <Image src={icon} alt={text} width={40} height={40} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-zinc-900">{fmtDayTR(d.date)}</p>
                          <p className="text-xs text-zinc-500">{text}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-semibold tabular-nums text-zinc-900">
                          {Math.round(d.tempMin)}° / {Math.round(d.tempMax)}°
                        </p>
                        <p className="text-xs text-zinc-500">
                          {d.precipProbMax != null ? `Yağış: ${Math.round(d.precipProbMax)}%` : "Yağış: -"}
                        </p>
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
