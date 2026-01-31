"use client";

import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

import { CATEGORY_MAP, CategoryKey } from "@/lib/categories";
import { useChildModeStore } from "@/store/childModeStore";
import { useToast } from "@/components/ui/ToastProvider";

/* ---------------- TYPES ---------------- */

export type FeedItem = {
  id: string;
  slug: string;
  title: string;
  title_ai: string | null;
  title_en?: string | null;
  image_url: string | null;
  category: string;
  published_at: string | null;
  created_at?: string | null;
  is_child_safe: boolean;
};

/* ---------------- IMAGE ---------------- */

const STORAGE =
  "https://supabase.kuzeybatihaber.cloud/storage/v1/object/public/news/";
const PLACEHOLDER = "/1.jpg";

function resolveImage(src: string | null) {
  if (!src || src.trim() === "") return PLACEHOLDER;
  if (src.startsWith("http")) return src;
  return STORAGE + src.replace(/^\/+/, "");
}

/* ---------------- HELPERS ---------------- */

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

function pickTitle(item: FeedItem, lang: "tr" | "en") {
  return lang === "en"
    ? item.title_en ?? item.title_ai ?? item.title
    : item.title_ai ?? item.title;
}

function effectiveDate(item: FeedItem) {
  const s = item.published_at ?? item.created_at;
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

function timeAgoTR(d: Date) {
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Az önce";
  if (m < 60) return `${m} dk önce`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} sa önce`;
  return `${Math.floor(h / 24)} gün önce`;
}

/* ---------------- REVEAL ---------------- */

function useReveal() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return { ref, show };
}

/* ---------------- LINK ---------------- */

function buildHref(item: FeedItem, lang: "tr" | "en") {
  const key = findCategoryKey(item.category);
  if (!key) return "#";

  return lang === "en"
    ? `/en/${CATEGORY_MAP[key].en}/${item.slug}`
    : `/${CATEGORY_MAP[key].tr}/${item.slug}`;
}

/* ---------------- COMPONENT ---------------- */

export default function FeedCard({
  item,
  lang,
}: {
  item: FeedItem;
  lang: "tr" | "en";
}) {
  const categoryKey = findCategoryKey(item.category);
  const imgSrc = resolveImage(item.image_url);
  const { ref, show } = useReveal();

  const childMode = useChildModeStore((s) => s.enabled);
  const { show: toast } = useToast();

  const blocked = childMode && item.is_child_safe === false;
  const [time, setTime] = useState("");

useEffect(() => {
  const date = effectiveDate(item);
  if (!date) return;
  setTime(timeAgoTR(date));
}, [item]);


  function handleBlocked(e: React.MouseEvent) {
    e.preventDefault();
    toast(
      lang === "en"
        ? "Disable child mode to view this content"
        : "Bu içeriği görmek için çocuk modunu kapatın",
      "error"
    );
  }

  const Card = (
    <div
      ref={ref}
      className={clsx(
        "group h-full rounded-3xl bg-white border border-black/5 shadow-sm overflow-hidden transition-all duration-500",
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      )}
    >
      <div className="p-4 md:p-5 flex flex-col gap-4">

        <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-black/5">
          <Image
            src={imgSrc}
            alt={pickTitle(item, lang)}
            fill
            sizes="(max-width:768px) 50vw, 380px"
            quality={40}
            placeholder="blur"
            blurDataURL="/1.jpg"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-transparent" />

          {categoryKey && (
            <span
              className="absolute left-3 top-3 z-10 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold text-white"
              style={{ backgroundColor: CATEGORY_MAP[categoryKey].color }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
              {lang === "en"
                ? CATEGORY_MAP[categoryKey].label_en
                : CATEGORY_MAP[categoryKey].label_tr}
            </span>
          )}

          {blocked && (
            <div
              onClick={handleBlocked}
              className="absolute inset-0 z-20 bg-pink-600/55 flex items-center justify-center cursor-not-allowed"
            >
              <span className="bg-white text-pink-700 text-xs font-bold px-4 py-2 rounded-full">
                {lang === "en"
                  ? "Not suitable for children"
                  : "Çocuklara uygun değil"}
              </span>
            </div>
          )}
        </div>

        <h3 className="text-[15px] md:text-[17px] font-extrabold leading-snug text-black line-clamp-3">
          {pickTitle(item, lang)}
        </h3>

        <div className="flex justify-end text-[12px] font-semibold text-black/45">
          {time}
        </div>
      </div>
    </div>
  );

  if (blocked) return <div>{Card}</div>;
  return <Link href={buildHref(item, lang)}>{Card}</Link>;
}
