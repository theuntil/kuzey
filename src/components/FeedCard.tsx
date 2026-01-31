"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

import { CATEGORY_MAP, CategoryKey } from "@/lib/categories";
import { useChildModeStore } from "@/store/childModeStore";
import { useToast } from "@/components/ui/ToastProvider";

/* ---------------- TYPES ---------------- */

export type FeedItem = {
  id: string;
  slug: string;
  title: string;
  title_ai: string | null;
  title_en: string | null;
  image_url: string | null;
  category: string;
  published_at: string | null;
  is_child_safe?: boolean;
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

/* ---------------- COMPONENT ---------------- */

export default function FeedCard({
  item,
  lang,
}: {
  item: FeedItem;
  lang: "tr" | "en";
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  const childModeEnabled = useChildModeStore((s) => s.enabled);
  const { show } = useToast();

  const isBlocked =
    childModeEnabled && item.is_child_safe === false;

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const k = Object.keys(CATEGORY_MAP).find(
    (x) =>
      CATEGORY_MAP[x as CategoryKey].label_tr
        .toLocaleLowerCase("tr-TR") ===
      item.category.toLocaleLowerCase("tr-TR")
  ) as CategoryKey | undefined;

  const label = k
    ? lang === "en"
      ? CATEGORY_MAP[k].label_en
      : CATEGORY_MAP[k].label_tr
    : item.category;

  const title =
    lang === "en"
      ? item.title_en ?? item.title
      : item.title_ai ?? item.title;

  function handleBlockedClick() {
    show(
      lang === "en"
        ? "Disable Child Mode to view this content"
        : "Bu içeriği görüntülemek için çocuk modunu kapatın",
      "error"
    );
  }

  return (
    <div
      ref={ref}
      onClick={isBlocked ? handleBlockedClick : undefined}
      className={clsx(
        "relative rounded-3xl bg-white border border-black/5 shadow-sm overflow-hidden transition-all duration-500 cursor-pointer",
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
        isBlocked && "cursor-not-allowed"
      )}
    >
      <div className="p-4 md:p-6">
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
          <Image
            src={img(item.image_url)}
            alt={title}
            fill
            quality={40}
            className="object-cover"
          />

          {isBlocked && (
            <div className="absolute inset-0 bg-pink-600/60 z-10 flex items-center justify-center">
              <span className="bg-white text-pink-700 text-xs font-bold px-4 py-2 rounded-full shadow">
                {lang === "en"
                  ? "Not suitable for children"
                  : "Çocuklara uygun değil"}
              </span>
            </div>
          )}
        </div>

        <div className="mt-3">
          <div className="text-xs font-semibold mb-1">{label}</div>
          <h3 className="text-[15.5px] md:text-[18px] font-extrabold leading-snug">
            {title}
          </h3>

          {item.published_at && (
            <div className="mt-2 text-right text-xs text-neutral-500">
              {timeAgo(item.published_at, lang)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
