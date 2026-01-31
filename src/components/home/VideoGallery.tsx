"use client";

import Link from "next/link";
import Image from "next/image";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

import { CATEGORY_MAP, CategoryKey } from "@/lib/categories";

/* ---------------- STORAGE ---------------- */

const STORAGE_BASE =
  "https://supabase.kuzeybatihaber.cloud/storage/v1/object/public/news/";

const FALLBACK_IMAGE = "/1.jpg";

/* ---------------- TYPES ---------------- */

export type VideoItem = {
  id: string;
  slug: string;
  title: string;
  title_ai: string | null;
  title_en: string | null;
  image_url: string | null;   // 🔥 KULLANACAĞIMIZ BU
  video_url: string | null;   // sadece "videolu haber mi?" kontrolü
  category: string;
};

/* ---------------- HELPERS ---------------- */

function pickTitle(item: VideoItem, lang: "tr" | "en") {
  return lang === "en"
    ? item.title_en ?? item.title_ai ?? item.title
    : item.title_ai ?? item.title;
}

function normTR(s: string) {
  return s.trim().toLocaleLowerCase("tr-TR");
}

function findCategoryKey(cat: string): CategoryKey | null {
  const keys = Object.keys(CATEGORY_MAP) as CategoryKey[];
  for (const k of keys) {
    if (normTR(CATEGORY_MAP[k].label_tr) === normTR(cat)) return k;
  }
  return null;
}

function buildHref(item: VideoItem, lang: "tr" | "en") {
  const key = findCategoryKey(item.category);
  if (!key) return "#";

  return lang === "en"
    ? `/en/${CATEGORY_MAP[key].en}/${item.slug}`
    : `/${CATEGORY_MAP[key].tr}/${item.slug}`;
}

function resolveImage(src: string | null) {
  if (!src || src.trim() === "") return FALLBACK_IMAGE;

  if (src.startsWith("http")) return src;

  return STORAGE_BASE + src.replace(/^\/+/, "");
}

/* ---------------- MAIN ---------------- */

type Props = {
  items: VideoItem[];
  lang: "tr" | "en";
};

export default function VideoGallery({ items, lang }: Props) {
  // videolu haber yoksa hiç render etme
  const videoItems = items?.filter((i) => i.video_url);
  if (!videoItems || videoItems.length === 0) return null;

  const rowRef = useRef<HTMLDivElement | null>(null);

  const scroll = (dir: "l" | "r") => {
    if (!rowRef.current) return;
    rowRef.current.scrollBy({
      left: dir === "l" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <section className="p-10 rounded-3xl bg-black">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-white text-xl font-bold">
          {lang === "en" ? "Video News" : "Video Haberler"}
        </h2>

        <div className="flex gap-2">
          <button
            onClick={() => scroll("l")}
            className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={() => scroll("r")}
            className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* ROW */}
      <div ref={rowRef} className="flex gap-4 overflow-x-auto">

        {videoItems.map((v) => {
          const imgSrc = resolveImage(v.image_url);

          return (
            <Link
              key={v.id}
              href={buildHref(v, lang)}
              className="min-w-[260px] block"
            >
              <div className="relative h-[170px] rounded-2xl overflow-hidden border border-white/10 bg-black">

                {/* IMAGE (VIDEO YOK) */}
                <Image
                  src={imgSrc}
                  alt={pickTitle(v, lang)}
                  fill
                  sizes="260px"
                  quality={40}
                  className="object-cover"
                />

                {/* DARK GRADIENT */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                {/* PLAY ICON */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-red-600/90 p-3 rounded-full">
                    <Play className="text-white" size={22} />
                  </div>
                </div>

                {/* TITLE */}
                <div className="
                  absolute bottom-0 left-0 right-0
                  h-[56px]
                  p-3
                  text-white text-sm font-semibold
                  flex items-end
                ">
                  <p className="leading-tight overflow-hidden line-clamp-2">
                    {pickTitle(v, lang)}
                  </p>
                </div>

              </div>
            </Link>
          );
        })}

      </div>
    </section>
  );
}
