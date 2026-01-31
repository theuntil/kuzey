"use client";
import { useAutoPageView } from "@/lib/analytics/useAutoPageView";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  Activity,
  Clock,
  MapPin,
  Search,
  ChevronDown,
  Layers,
  LocateFixed,
} from "lucide-react";
import type { EarthquakeItem } from "./types";
import {
  fillForMag,
  formatTRDateTime,
  labelForMagTR,
} from "./utils";

const EarthquakeMap = dynamic(() => import("./EarthquakeMap"), { ssr: false });

type SortKey = "time_desc" | "mag_desc";

function chipClass(mag: number) {
  if (mag >= 6) return "bg-red-50 text-red-700 ring-red-100";
  if (mag >= 5) return "bg-orange-50 text-orange-700 ring-orange-100";
  if (mag >= 4) return "bg-amber-50 text-amber-700 ring-amber-100";
  return "bg-zinc-50 text-zinc-700 ring-zinc-200";
}

function parseTime(isoLike: string) {
  const d = new Date(isoLike.replace(" ", "T"));
  return Number.isNaN(d.getTime()) ? 0 : d.getTime();
}

function niceTitle(title: string) {
  return title.replace(/\s+/g, " ").trim();
}

export default function EarthquakeUI({ items }: { items: EarthquakeItem[] }) {
useAutoPageView(); 
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);
  const [q, setQ] = useState("");
  const [minMag, setMinMag] = useState<number>(0);
  const [sortKey, setSortKey] = useState<SortKey>("time_desc");

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const active = useMemo(() => {
    return items.find((x) => x.id === activeId) ?? null;
  }, [items, activeId]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();

    let arr = items.filter((x) => x.mag >= minMag);

    if (s) {
      arr = arr.filter((x) => {
        const hay = `${x.title} ${x.mag} ${x.depthKm ?? ""}`.toLowerCase();
        return hay.includes(s);
      });
    }

    if (sortKey === "mag_desc") {
      arr = [...arr].sort((a, b) => b.mag - a.mag || parseTime(b.timeISO) - parseTime(a.timeISO));
    } else {
      arr = [...arr].sort((a, b) => parseTime(b.timeISO) - parseTime(a.timeISO));
    }

    return arr;
  }, [items, q, minMag, sortKey]);

  // Türkiye genel merkez
  const center = { lat: 39.0, lon: 35.0 };

  // focus: seçili deprem
  const focus = active ? { lat: active.lat, lon: active.lon } : null;

  // küçük özet
  const stats = useMemo(() => {
    const count = filtered.length;
    const maxMag = filtered.reduce((m, x) => (x.mag > m ? x.mag : m), 0);
    const last = filtered[0] ?? null;
    return { count, maxMag, last };
  }, [filtered]);

  return (
    <main className="min-h-dvh">
      <div
        className={[
          "mx-auto w-full max-w-7xl px-4 py-6",
          "transition-all duration-500 motion-reduce:transition-none",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        ].join(" ")}
      >
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Son Depremler
            </h1>

            {/* quick stats */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-600">
             

              {stats.last ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 ring-1 ring-zinc-200 shadow-sm">
                  <Clock className="h-4 w-4 text-zinc-500" />
                  <span className="font-medium">En son:</span>
                  <span className="tabular-nums">{formatTRDateTime(stats.last.timeISO)}</span>
                </span>
              ) : null}
            </div>
          </div>

          {/* Controls */}
          <div className="flex w-full flex-col gap-3 sm:w-[420px]">
            {/* Search */}
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Bölge / il / ilçe / büyüklük ara…"
                className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-4 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-300"
              />
              <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Min magnitude */}
              <div className="relative">
                <select
                  value={String(minMag)}
                  onChange={(e) => setMinMag(Number(e.target.value))}
                  className="h-11 w-full appearance-none rounded-xl border border-zinc-200 bg-white px-4 pr-10 text-sm font-medium text-zinc-900 shadow-sm outline-none transition focus:border-zinc-300"
                >
                  <option value="0">Tümü</option>
                  <option value="2">2.0+</option>
                  <option value="3">3.0+</option>
                  <option value="4">4.0+</option>
                  <option value="5">5.0+</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-zinc-500" />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as SortKey)}
                  className="h-11 w-full appearance-none rounded-xl border border-zinc-200 bg-white px-4 pr-10 text-sm font-medium text-zinc-900 shadow-sm outline-none transition focus:border-zinc-300"
                >
                  <option value="time_desc">Tarihe göre</option>
                  <option value="mag_desc">Büyüklüğe göre</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-zinc-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="grid gap-4 lg:grid-cols-12">
          {/* Map */}
          <section className="lg:col-span-8">
            <div className="rounded-3xl border border-zinc-200 bg-white p-3 shadow-sm">
              <div className="mb-3 flex items-center justify-between px-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                  <LocateFixed className="h-4 w-4 text-zinc-500" />
                  Harita
                </div>

                {active ? (
                  <span
                    className={[
                      "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1",
                      chipClass(active.mag),
                    ].join(" ")}
                  >
                    <Activity className="h-4 w-4" />
                    <span className="tabular-nums">{active.mag.toFixed(1)}</span>
                    <span className="font-medium">{labelForMagTR(active.mag)}</span>
                  </span>
                ) : null}
              </div>

              <EarthquakeMap
                items={filtered}
                activeId={activeId}
                onSelect={(id) => startTransition(() => setActiveId(id))}
                center={center}
                focus={focus}
              />

              {active ? (
                <div className="mt-3 rounded-2xl bg-zinc-50 p-4 ring-1 ring-zinc-200">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-zinc-500">Seçili deprem</p>
                      <h2 className="mt-1 text-base font-semibold text-zinc-900">
                        {niceTitle(active.title)}
                      </h2>

                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-600">
                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 ring-1 ring-zinc-200">
                          <Clock className="h-3.5 w-3.5 text-zinc-500" />
                          {formatTRDateTime(active.timeISO)}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 ring-1 ring-zinc-200">
                          <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                          <span className="tabular-nums">
                            {active.lat.toFixed(3)}, {active.lon.toFixed(3)}
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 ring-1 ring-zinc-200">
                          Derinlik:
                          <span className="font-semibold tabular-nums">
                            {active.depthKm ?? "-"} km
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <div
                        className="grid h-12 w-12 place-items-center rounded-2xl text-white"
                        style={{ backgroundColor: fillForMag(active.mag) }}
                      >
                        <Activity className="h-6 w-6" />
                      </div>
                    </div>
                  </div>

                  {isPending ? (
                    <p className="mt-3 text-xs text-zinc-500">Odaklanıyor…</p>
                  ) : null}
                </div>
              ) : null}
            </div>
          </section>

          {/* List */}
          <aside className="lg:col-span-4">
            <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-semibold text-zinc-900">Deprem Listesi</h3>
                <span className="text-xs text-zinc-500 tabular-nums">
                  {filtered.length} kayıt
                </span>
              </div>

              <div className="max-h-[640px] space-y-3 overflow-auto pr-1">
                {filtered.length === 0 ? (
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-600">
                    Filtrelere uygun deprem bulunamadı.
                  </div>
                ) : (
                  filtered.map((eq) => {
                    const isActive = eq.id === activeId;

                    return (
                      <button
                        key={eq.id}
                        type="button"
                        onClick={() => startTransition(() => setActiveId(eq.id))}
                        className={[
                          "w-full text-left rounded-2xl border p-4 transition",
                          isActive
                            ? "border-zinc-900/15 ring-2 ring-zinc-900/10 bg-zinc-50"
                            : "border-zinc-200 hover:border-zinc-300 bg-white",
                        ].join(" ")}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-zinc-900 line-clamp-2">
                              {niceTitle(eq.title)}
                            </p>

                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-600">
                              <span className="inline-flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5 text-zinc-500" />
                                {formatTRDateTime(eq.timeISO)}
                              </span>

                              <span className="inline-flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                                <span className="tabular-nums">
                                  {eq.lat.toFixed(2)}, {eq.lon.toFixed(2)}
                                </span>
                              </span>
                            </div>

                            <div className="mt-2 text-xs text-zinc-600">
                              Derinlik:{" "}
                              <span className="font-semibold tabular-nums">
                                {eq.depthKm ?? "-"} km
                              </span>
                            </div>
                          </div>

                          <div className="shrink-0 text-right">
                            <span
                              className={[
                                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 tabular-nums",
                                chipClass(eq.mag),
                              ].join(" ")}
                            >
                              {eq.mag.toFixed(1)}
                            </span>

                            <div className="mt-2 flex items-center justify-end gap-2">
                              <span
                                className="inline-block h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: fillForMag(eq.mag) }}
                              />
                              <span className="text-[11px] text-zinc-500">
                                {labelForMagTR(eq.mag)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

            
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
