"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useChildModeStore } from "@/store/childModeStore";
import { useToast } from "@/components/ui/ToastProvider";
import { CATEGORY_MAP, CategoryKey } from "@/lib/categories";

/* ---------------- TYPES ---------------- */

export type HeroItem = {
  id: string;
  slug: string;
  title: string;
  title_ai: string | null;
  title_en?: string | null;
  image_url: string | null;
  category: string;
  published_at: string | null;
  is_child_safe: boolean;
};

/* ---------------- CONST ---------------- */

const STORAGE =
  "https://supabase.kuzeybatihaber.cloud/storage/v1/object/public/news/";
const PLACEHOLDER = "/1.jpg";
const AUTO_INTERVAL = 6000;

const TITLE_OUT_MS = 220;
const TITLE_IN_MS = 320;

/* ---------------- HELPERS ---------------- */

function resolveImage(src: string | null) {
  if (!src) return PLACEHOLDER;
  if (src.startsWith("http")) return src;
  return STORAGE + src.replace(/^\/+/, "");
}

function pickTitle(item: HeroItem, lang: "tr" | "en") {
  if (lang === "en") return item.title_en ?? item.title_ai ?? item.title;
  return item.title_ai ?? item.title;
}

function normTR(s: string) {
  return s.trim().toLocaleLowerCase("tr-TR");
}

function findCategoryKey(dbCategory: string): CategoryKey | null {
  const keys = Object.keys(CATEGORY_MAP) as CategoryKey[];
  for (const k of keys) {
    if (normTR(CATEGORY_MAP[k].label_tr) === normTR(dbCategory)) return k;
  }
  return null;
}

function buildHref(item: HeroItem, lang: "tr" | "en") {
  const key = findCategoryKey(item.category);
  if (!key) return "#";
  return lang === "en"
    ? `/en/${CATEGORY_MAP[key].en}/${item.slug}`
    : `/${CATEGORY_MAP[key].tr}/${item.slug}`;
}

/* ---------------- COMPONENT ---------------- */

export default function HeroManşet({ lang }: { lang: "tr" | "en" }) {
  const [items, setItems] = useState<HeroItem[]>([]);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");
  const [loading, setLoading] = useState(true);

  const indexRef = useRef(0); // 🔑 GERÇEK INDEX
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animatingRef = useRef(false);
  const startX = useRef(0);

  const childMode = useChildModeStore((s) => s.enabled);
  const { show: toast } = useToast();

  /* -------- DATA -------- */

  useEffect(() => {
    fetch("/api/hero-breaking", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setItems(d.slice(0, 7)))
      .finally(() => setLoading(false));
  }, []);

  /* -------- TIMER (STABLE) -------- */

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      const next = (indexRef.current + 1) % items.length;
      transitionTo(next);
    }, AUTO_INTERVAL);
  };

  useEffect(() => {
    if (!items.length) return;
    startTimer();
    return stopTimer;
  }, [items.length]);

  /* -------- CORE TRANSITION -------- */

  const transitionTo = (nextIndex: number) => {
    if (animatingRef.current) return;
    if (nextIndex === indexRef.current) return;

    animatingRef.current = true;
    stopTimer();

    setPhase("out");

    setTimeout(() => {
      indexRef.current = nextIndex;
      setDisplayIndex(nextIndex);
      setPhase("in");

      setTimeout(() => {
        setPhase("idle");
        animatingRef.current = false;
        startTimer();
      }, TITLE_IN_MS);
    }, TITLE_OUT_MS);
  };

  /* -------- NAV -------- */

  const goNext = () =>
    transitionTo((indexRef.current + 1) % items.length);

  const goPrev = () =>
    transitionTo((indexRef.current - 1 + items.length) % items.length);

  /* -------- SWIPE -------- */

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) < 40) return;
    dx < 0 ? goNext() : goPrev();
  };

  /* -------- BLOCK -------- */

  const handleBlocked = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast(
      lang === "en"
        ? "Disable child mode to view this content"
        : "Bu içeriği görmek için çocuk modunu kapatın",
      "error"
    );
  };

  /* -------- RENDER -------- */

  if (loading || !items.length) {
    return (
      <div className="w-full aspect-[16/9] md:h-[360px] rounded-3xl bg-neutral-200 animate-pulse" />
    );
  }

  const item = items[displayIndex];
  const blocked = childMode && item.is_child_safe === false;
  const categoryKey = findCategoryKey(item.category);

  return (
    <div
      className="
        relative w-full overflow-hidden bg-black rounded-3xl
        aspect-[16/9] md:aspect-auto md:h-[360px] lg:h-[450px]
      "
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* LINK */}
      <Link href={buildHref(item, lang)} className="absolute inset-0 z-10">
        <Image
          src={resolveImage(item.image_url)}
          alt={pickTitle(item, lang)}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
      </Link>

      {/* TITLE – SINGLE, SAFE */}
      <div className="absolute bottom-0 p-8 max-w-3xl z-20 pointer-events-none">
       <h1
  className={clsx(
    "text-white text-[18px] md:text-[24px] lg:text-[26px] font-extrabold leading-tight transition-all",
    "line-clamp-2 overflow-hidden",
    phase === "out" && "opacity-0 translate-y-3 duration-200",
    phase === "in" && "opacity-100 translate-y-0 duration-300"
  )}
>
          {pickTitle(item, lang)}
        </h1>
      </div>

      {/* CATEGORY */}
      {categoryKey && (
        <span
          className="absolute top-4 left-4 z-30 px-4 py-1 rounded-full text-xs font-bold text-white"
          style={{ backgroundColor: CATEGORY_MAP[categoryKey].color }}
        >
          {lang === "en"
            ? CATEGORY_MAP[categoryKey].label_en
            : CATEGORY_MAP[categoryKey].label_tr}
        </span>
      )}

      {/* ARROWS */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          goPrev();
        }}
        className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-30 h-10 w-10 rounded-full bg-black/40 hover:bg-black/60 text-white items-center justify-center"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          goNext();
        }}
        className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-30 h-10 w-10 rounded-full bg-black/40 hover:bg-black/60 text-white items-center justify-center"
      >
        <ChevronRight size={22} />
      </button>

      {/* DOTS */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              transitionTo(i);
            }}
            className={clsx(
              "h-2 rounded-full transition-all",
              i === displayIndex ? "w-6 bg-white" : "w-2 bg-white/40"
            )}
          />
        ))}
      </div>

      {/* BLOCK */}
      {blocked && (
        <div
          onClick={handleBlocked}
          className="absolute inset-0 z-40 bg-pink-600/60 flex items-center justify-center"
        >
          <span className="bg-white text-pink-700 px-5 py-2 rounded-full font-bold">
            Çocuklara uygun değil
          </span>
        </div>
      )}
    </div>
  );
}
