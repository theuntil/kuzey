"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DollarSign,
  Euro,
  PoundSterling,
  Coins,
  Landmark,
  JapaneseYen,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

/* ---------------- TYPES ---------------- */
type Item = {
  code: string;
  value: number;
  diff: number;
  pct: number;
};

const ORDER = ["USD", "EUR", "GBP", "CHF", "DKK", "JPY"];

/* ---------------- COMPONENT ---------------- */
export default function MarketsPanel() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;

    fetch("/api/markets", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (!alive) return;
        setItems(j?.success ? j.data : []);
        requestAnimationFrame(() => setReady(true));
      })
      .catch(() => {
        if (alive) {
          setItems([]);
          requestAnimationFrame(() => setReady(true));
        }
      });

    return () => {
      alive = false;
    };
  }, []);

  const usd = useMemo(
    () => items?.find((i) => i.code === "USD") ?? null,
    [items]
  );

  /* ---------------- MOBILE MINI BAR ---------------- */

  const MobileUSDBar = (
    <div
      className={`
        lg:hidden
        w-[33%]
        max-w-[160px]
        h-9
        bg-white
        rounded-full
        shadow-sm
        px-2
        flex
        items-center
        gap-1.5
        transition-all
        duration-500
        ${ready ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"}
      `}
    >
      {/* ICON */}
      <div className="w-5 h-5 shrink-0 flex items-center justify-center">
        {usd ? (
          <DollarSign size={16} />
        ) : (
          <div className="w-5 h-5 bg-neutral-200 rounded-full animate-pulse" />
        )}
      </div>

      {/* CODE */}
      <div className="text-[11px] font-medium text-neutral-600">
        USD
      </div>

      {/* VALUE + TREND */}
      <div className="ml-auto flex items-center gap-1 tabular-nums">
        {usd ? (
          <>
            <span className="text-xs font-bold text-neutral-900">
              {usd.value.toFixed(2)} ₺
            </span>
            <span
              className={`flex items-center text-xs ${
                usd.diff >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {usd.diff >= 0 ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )}
            </span>
          </>
        ) : (
          <div className="w-14 h-4 bg-neutral-200 rounded animate-pulse" />
        )}
      </div>
    </div>
  );

  /* ---------------- DESKTOP (AYNEN) ---------------- */

  return (
    <>
      {MobileUSDBar}

      <section className="hidden lg:block bg-white rounded-3xl p-6 shadow-sm animate-soft-in min-h-[320px]">
        {/* HEADER */}
        <header className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-green-600" />
          <h3 className="text-sm font-semibold">Piyasalar</h3>
        </header>

        {/* CONTENT */}
        {items === null ? (
          <Skeleton />
        ) : items.length === 0 ? (
          <p className="text-xs text-neutral-400">
            Piyasa verisi alınamadı
          </p>
        ) : (
          <ul className="space-y-3 text-sm">
            {ORDER.map((code) => {
              const item = items.find((i) => i.code === code);
              return item ? (
                <Row key={code} item={item} />
              ) : (
                <EmptyRow key={code} code={code} />
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}

/* ---------------- ROW ---------------- */

function Row({ item }: { item: Item }) {
  const up = item.diff >= 0;

  return (
    <li className="flex items-center justify-between h-[36px]">
      <span className="flex items-center gap-2 text-neutral-600">
        <CurrencyIcon code={item.code} />
        {item.code}
      </span>

      <span className="flex items-center gap-2 font-semibold tabular-nums">
        {item.value.toFixed(2)} ₺
        <span
          className={`flex items-center gap-1 text-xs ${
            up ? "text-green-600" : "text-red-600"
          }`}
        >
          {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {item.pct.toFixed(2)}%
        </span>
      </span>
    </li>
  );
}

/* ---------------- EMPTY ROW ---------------- */

function EmptyRow({ code }: { code: string }) {
  return (
    <li className="flex items-center justify-between h-[36px] opacity-40">
      <span className="flex items-center gap-2 text-neutral-400">
        <CurrencyIcon code={code} />
        {code}
      </span>
      <span className="text-xs text-neutral-400">—</span>
    </li>
  );
}

/* ---------------- ICON MAP ---------------- */

function CurrencyIcon({ code }: { code: string }) {
  switch (code) {
    case "USD":
      return <DollarSign size={14} />;
    case "EUR":
      return <Euro size={14} />;
    case "GBP":
      return <PoundSterling size={14} />;
    case "CHF":
      return <Landmark size={14} />;
    case "DKK":
      return <Coins size={14} />;
    case "JPY":
      return <JapaneseYen size={14} />;
    default:
      return <Coins size={14} />;
  }
}

/* ---------------- SKELETON ---------------- */

function Skeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {ORDER.map((c) => (
        <div
          key={c}
          className="flex items-center justify-between h-[36px]"
        >
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-neutral-200" />
            <div className="h-3 w-10 bg-neutral-200 rounded" />
          </div>
          <div className="h-3 w-24 bg-neutral-200 rounded" />
        </div>
      ))}
    </div>
  );
}
