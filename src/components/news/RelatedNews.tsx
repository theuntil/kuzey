"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { CATEGORY_MAP, CategoryKey } from "@/lib/categories";

/* ---------------- TYPES ---------------- */
type NewsItem = {
  id: string;
  slug: string;
  title: string;
  title_ai: string | null;
  title_en: string | null;
  image_url: string | null;
  published_at: string | null;
  category: string;
};

type Props = {
  dbCategory: string;
  lang: "tr" | "en";
  currentSlug?: string;
};

/* ---------------- IMAGE ---------------- */
const STORAGE =
  "https://supabase.kuzeybatihaber.cloud/storage/v1/object/public/news/";
const PLACEHOLDER =
  "https://supabase.kuzeybatihaber.cloud/storage/v1/object/public/news/images/1.jpg";

function img(src: string | null) {
  if (!src) return PLACEHOLDER;
  if (src.startsWith("http")) return src;
  return STORAGE + src.replace(/^\/+/, "");
}

/* ---------------- TIME ---------------- */
function timeAgo(date: string, lang: "tr" | "en") {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);

  if (m < 1) return lang === "en" ? "just now" : "az önce";
  if (m < 60) return lang === "en" ? `${m} min ago` : `${m} dk önce`;
  if (h < 24) return lang === "en" ? `${h} hours ago` : `${h} saat önce`;
  return lang === "en" ? `${d} days ago` : `${d} gün önce`;
}

/* ---------------- CATEGORY MATCH ---------------- */
function norm(s: string) {
  return s.trim().toLocaleLowerCase("tr-TR");
}

function findCategoryKey(dbCategory: string): CategoryKey | null {
  const keys = Object.keys(CATEGORY_MAP) as CategoryKey[];
  for (const k of keys) {
    if (norm(CATEGORY_MAP[k].label_tr) === norm(dbCategory)) {
      return k;
    }
  }
  return null;
}

/* ---------------- SKELETON ---------------- */
function Skeleton() {
  return (
    <section className="rounded-3xl">
      <div className="h-6 w-40 bg-neutral-200 rounded-md animate-pulse mb-4" />

      {/* MOBIL – 2 KOLON GRID */}
      <div className="lg:hidden grid grid-cols-2 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="w-full aspect-[16/9] rounded-2xl bg-neutral-200 animate-pulse" />
            <div className="mt-2 h-4 bg-neutral-200 rounded-md animate-pulse" />
            <div className="mt-1 h-3 w-24 bg-neutral-200 rounded-md animate-pulse" />
          </div>
        ))}
      </div>

      {/* DESKTOP – AYNI */}
      <div className="hidden lg:block space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-15 aspect-[3/4] rounded-xl bg-neutral-200 animate-pulse shrink-0" />
            <div className="flex-1 py-1 space-y-2">
              <div className="h-4 bg-neutral-200 rounded-md animate-pulse" />
              <div className="h-3 w-24 bg-neutral-200 rounded-md animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- COMPONENT ---------------- */
export default function RelatedNews({ dbCategory, lang, currentSlug }: Props) {
  const [items, setItems] = useState<NewsItem[] | null>(null);

  const categoryKey = useMemo(
    () => findCategoryKey(dbCategory),
    [dbCategory]
  );

  const label =
    categoryKey
      ? lang === "en"
        ? CATEGORY_MAP[categoryKey].label_en
        : CATEGORY_MAP[categoryKey].label_tr
      : dbCategory;

  const segment =
    categoryKey
      ? lang === "en"
        ? CATEGORY_MAP[categoryKey].en
        : CATEGORY_MAP[categoryKey].tr
      : null;

  useEffect(() => {
    let alive = true;

    async function load() {
      setItems(null);

      const qs = new URLSearchParams();
      qs.set("category", dbCategory);
      qs.set("limit", "8");
      if (currentSlug) qs.set("exclude", currentSlug);

      const res = await fetch(`/api/related-news?${qs}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        if (alive) setItems([]);
        return;
      }

      const data = (await res.json()) as NewsItem[];
      if (alive) setItems(data);
    }

    load();
    return () => {
      alive = false;
    };
  }, [dbCategory, currentSlug]);

  if (items === null) return <Skeleton />;
  if (items.length === 0) return null;

  return (
    <section className="rounded-3xl">
      <h2 className="text-xl font-bold mb-4">
        {lang === "en" ? "More" : "Daha Fazla"}{" "}
        <span className="underline underline-offset-4 decoration-2">
          {label}
        </span>
      </h2>

      {/* ---------------- MOBİL – 2 KOLON GRID ---------------- */}
      <div className="lg:hidden grid grid-cols-2 gap-4">
        {items.map((n) => {
          const title =
            lang === "en"
              ? n.title_en ?? n.title
              : n.title_ai ?? n.title;

          const href =
            segment
              ? lang === "en"
                ? `/en/${segment}/${n.slug}`
                : `/${segment}/${n.slug}`
              : "#";

          return (
            <Link key={n.id} href={href}>
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-neutral-100">
                <Image
                  src={img(n.image_url)}
                  alt={title}
                  fill
                  quality={40}
                  className="object-cover  animate-fade-in"
                />
              </div>

              <p className="mt-2 text-sm font-semibold leading-snug line-clamp-2">
                {title}
              </p>

              <span className="text-xs text-neutral-500">
                {n.published_at ? timeAgo(n.published_at, lang) : ""}
              </span>
            </Link>
          );
        })}
      </div>

      {/* ---------------- DESKTOP – AYNI ---------------- */}
      <div className="hidden lg:block space-y-4">
        {items.map((n) => {
          const title =
            lang === "en"
              ? n.title_en ?? n.title
              : n.title_ai ?? n.title;

          const href =
            segment
              ? lang === "en"
                ? `/en/${segment}/${n.slug}`
                : `/${segment}/${n.slug}`
              : "#";

          return (
            <Link
              key={n.id}
              href={href}
              className="flex gap-3 hover:opacity-80 transition"
            >
              <div className="relative w-15 aspect-[3/4] rounded-xl overflow-hidden shrink-0 bg-neutral-100">
                <Image
                  src={img(n.image_url)}
                  alt={title}
                  fill
                  quality={40}
                  className="object-cover animate-fade-in"
                />
              </div>

              <div className="py-1">
                <p className="text-sm font-semibold leading-snug line-clamp-2">
                  {title}
                </p>
                <span className="text-xs text-neutral-500">
                  {n.published_at ? timeAgo(n.published_at, lang) : ""}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
