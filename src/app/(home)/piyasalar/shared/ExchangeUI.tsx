"use client";
import { useAutoPageView } from "@/lib/analytics/useAutoPageView";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Euro,
  PoundSterling,
  Coins,
  Landmark,
  JapaneseYen,
} from "lucide-react";

type Item = {
  code: string;
  value: number;
  diff: number;
  pct: number;
};

type ApiResp =
  | { success: true; data: Item[]; updatedAt: string }
  | { success: false; error?: string };

const DEFAULT_ORDER = [
  "USD",
  "EUR",
  "GBP",
  "CHF",
  "DKK",
  "JPY",
  "CAD",
  "AUD",
  "SEK",
  "NOK",
  "SAR",
  "RUB",
  "CNY",
];

function fmtTRY(n: number) {
  return n.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
}

function fmtPct(n: number) {
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
}

function iconFor(code: string) {
  switch (code) {
    case "USD":
      return DollarSign;
    case "EUR":
      return Euro;
    case "GBP":
      return PoundSterling;
    case "CHF":
      return Landmark;
    case "DKK":
      return Coins;
    case "JPY":
      return JapaneseYen;
    default:
      return Coins;
  }
}

export default function ExchangeUI() {
   useAutoPageView(); 
  const [items, setItems] = useState<Item[] | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  async function load() {
    setRefreshing(true);
    try {
      const r = await fetch("/api/markets", { cache: "no-store" });
      const j = (await r.json()) as ApiResp;

      if ("success" in j && j.success) {
        setItems(j.data ?? []);
        setUpdatedAt(j.updatedAt ?? null);
      } else {
        setItems([]);
        setUpdatedAt(null);
      }
    } catch {
      setItems([]);
      setUpdatedAt(null);
    } finally {
      requestAnimationFrame(() => setRefreshing(false));
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const ordered = useMemo(() => {
    const base = items ?? [];
    const rank = new Map<string, number>();
    DEFAULT_ORDER.forEach((c, i) => rank.set(c, i));

    return [...base].sort((a, b) => {
      const ra = rank.has(a.code) ? rank.get(a.code)! : 9999;
      const rb = rank.has(b.code) ? rank.get(b.code)! : 9999;
      if (ra !== rb) return ra - rb;
      return a.code.localeCompare(b.code);
    });
  }, [items]);

  const topMovers = useMemo(() => {
    const arr = (items ?? []).slice().sort((a, b) => Math.abs(b.pct) - Math.abs(a.pct));
    return arr.slice(0, 4);
  }, [items]);

  return (
    <main className="min-h-dvh ">
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
              Döviz Kurları
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
            Türkiye Cumhuriyeti Merkez Bankası Verileri
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 ring-1 ring-zinc-200">
                <TrendingUp className="h-4 w-4" />
                {items === null ? "Yükleniyor…" : `${items.length} birim`}
              </span>

              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 ring-1 ring-zinc-200">
                <RefreshCw className={["h-4 w-4", refreshing ? "animate-spin" : ""].join(" ")} />
                {updatedAt ? new Date(updatedAt).toLocaleString("tr-TR") : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Top movers */}
        <section className="mb-6">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-zinc-900">
                Günün hareketlileri
              </h2>
             
            </div>

            {items === null ? (
              <TopSkeleton />
            ) : topMovers.length === 0 ? (
              <p className="mt-4 text-sm text-zinc-600">Veri alınamadı.</p>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {topMovers.map((x) => (
                  <MoverCard key={x.code} item={x} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Table */}
        <section>
          <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-200 p-5 sm:p-6">
              <h2 className="text-base font-semibold text-zinc-900">Tüm kurlar</h2>
              <span className="text-xs text-zinc-500">TRY bazlı</span>
            </div>

            {items === null ? (
              <TableSkeleton />
            ) : ordered.length === 0 ? (
              <div className="p-6 text-sm text-zinc-600">Kayıt bulunamadı.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-zinc-50 text-xs text-zinc-600">
                    <tr>
                      <th className="px-5 py-3 font-medium sm:px-6">Birim</th>
                      <th className="px-5 py-3 font-medium sm:px-6">Kur</th>
                      <th className="px-5 py-3 font-medium sm:px-6">Günlük</th>
                      <th className="px-5 py-3 font-medium sm:px-6">% Değişim</th>
                      <th className="px-5 py-3 font-medium sm:px-6">Trend</th>
                    </tr>
                  </thead>

                  <tbody>
                    {ordered.map((x) => (
                      <Row key={x.code} item={x} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <p className="mt-4 text-xs text-zinc-500">
            Not: TCMB EVDS serileri resmi tatiller/hafta sonu güncellenmeyebilir. Bu nedenle son iki
            geçerli iş günü bulunarak değişim hesaplanır.
          </p>
        </section>
      </div>
    </main>
  );
}

function Row({ item }: { item: Item }) {
  const up = item.diff >= 0;
  const Icon = iconFor(item.code);

  return (
    <tr className="border-t border-zinc-200">
      <td className="px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-zinc-50 ring-1 ring-zinc-200">
            <Icon className="h-4 w-4 text-zinc-700" />
          </div>
          <div>
            <p className="font-semibold text-zinc-900">{item.code}</p>
            <p className="text-xs text-zinc-500">TCMB</p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4 font-semibold tabular-nums text-zinc-900 sm:px-6">
        {fmtTRY(item.value)} ₺
      </td>

      <td className="px-5 py-4 tabular-nums sm:px-6">
        <span
          className={[
            "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ring-1",
            up
              ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
              : "bg-rose-50 text-rose-700 ring-rose-100",
          ].join(" ")}
        >
          {up ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" />
          )}
          {item.diff >= 0 ? "+" : ""}
          {item.diff.toFixed(4)}
        </span>
      </td>

      <td className="px-5 py-4 tabular-nums sm:px-6">
        <span className={up ? "text-emerald-700" : "text-rose-700"}>
          {fmtPct(item.pct)}
        </span>
      </td>

      <td className="px-5 py-4 sm:px-6">
        <span className="inline-flex items-center gap-2 text-xs text-zinc-600">
          {up ? (
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-rose-600" />
          )}
          {up ? "Yükseliş" : "Düşüş"}
        </span>
      </td>
    </tr>
  );
}

function MoverCard({ item }: { item: Item }) {
  const up = item.diff >= 0;
  const Icon = iconFor(item.code);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-zinc-50 ring-1 ring-zinc-200">
            <Icon className="h-5 w-5 text-zinc-700" />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900">{item.code}</p>
            <p className="text-xs text-zinc-500">Kur: {fmtTRY(item.value)} ₺</p>
          </div>
        </div>

        <span
          className={[
            "rounded-full px-3 py-1 text-xs font-semibold ring-1 tabular-nums",
            up
              ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
              : "bg-rose-50 text-rose-700 ring-rose-100",
          ].join(" ")}
        >
          {fmtPct(item.pct)}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-zinc-600">
        <span className="tabular-nums">
          Günlük: {item.diff >= 0 ? "+" : ""}
          {item.diff.toFixed(4)}
        </span>
        <span className="inline-flex items-center gap-1">
          {up ? (
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-rose-600" />
          )}
          {up ? "Yukarı" : "Aşağı"}
        </span>
      </div>
    </div>
  );
}

function TopSkeleton() {
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-zinc-200 bg-white p-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-zinc-200" />
              <div>
                <div className="h-3 w-16 rounded bg-zinc-200" />
                <div className="mt-2 h-3 w-28 rounded bg-zinc-200" />
              </div>
            </div>
            <div className="h-6 w-16 rounded-full bg-zinc-200" />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="h-3 w-24 rounded bg-zinc-200" />
            <div className="h-3 w-16 rounded bg-zinc-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="p-6">
      <div className="animate-pulse space-y-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-zinc-200" />
              <div>
                <div className="h-3 w-12 rounded bg-zinc-200" />
                <div className="mt-2 h-3 w-16 rounded bg-zinc-200" />
              </div>
            </div>
            <div className="h-3 w-24 rounded bg-zinc-200" />
            <div className="h-6 w-24 rounded-full bg-zinc-200" />
            <div className="h-3 w-16 rounded bg-zinc-200" />
            <div className="h-3 w-20 rounded bg-zinc-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
