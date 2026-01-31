"use client";

import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { CATEGORY_MAP, CategoryKey } from "@/lib/categories";

const STORAGE =
  "https://supabase.kuzeybatihaber.cloud/storage/v1/object/public/news/";
const PLACEHOLDER = "/1.jpg";

function resolveImage(src: string | null) {
  if (!src || src.trim() === "") return PLACEHOLDER;
  if (src.startsWith("http")) return src;
  return STORAGE + src.replace(/^\/+/, "");
}
function timeAgoTR(dateString?: string | null) {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  const sec = Math.floor(diffMs / 1000);

  if (sec < 60) return `${sec} Saniye önce`;

  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} Dk önce`;

  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour} Saat önce`;

  const day = Math.floor(hour / 24);
  if (day < 7) return `${day} Gün önce`;

  const week = Math.floor(day / 7);
  if (week < 5) return `${week} Hafta önce`;

  const month = Math.floor(day / 30);
  if (month < 12) return `${month} Ay önce`;

  const year = Math.floor(day / 365);
  return `${year} yıl önce`;
}

export default function CategoryFeedCard({
  item,
  categoryKey,
  blocked,
  onBlocked,
}: {
  item: any;
  categoryKey: CategoryKey;
  blocked: boolean;
  onBlocked: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setShown(true),
      { threshold: 0.15 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const href = `/${CATEGORY_MAP[categoryKey].tr}/${item.slug}`;

  const Card = (
    <div
      ref={ref}
      className={clsx(
        "h-full flex flex-col rounded-[20px] bg-white overflow-hidden",
        "shadow-[0_10px_30px_rgba(0,0,0,0.08)]",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]",
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      )}
    >
      {/* IMAGE */}
      <div className="relative aspect-[4/3] shrink-0">
        <Image
          src={resolveImage(item.image_url)}
          alt={item.title}
          fill
          quality={45}
          sizes="(max-width:768px) 100vw, 380px"
          className="object-cover"
        />

        <span
          className="absolute top-4 left-4 px-4 py-1.5 rounded-full text-xs font-bold text-white"
          style={{ backgroundColor: CATEGORY_MAP[categoryKey].color }}
        >
          {CATEGORY_MAP[categoryKey].label_tr}
        </span>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col flex-1 px-7 py-4 md:px-8 md:py-7">
        <div className="flex items-center gap-3 mb-3">
         
          <span className="text-xs font-semibold text-gray-600">
            Kuzeybatı Haber
          </span>
        </div>

        <h3 className="text-[16px]  md:text-[20px]  font-extrabold leading-tight mb-3 md:mb-2 line-clamp-3">
          {item.title_ai ?? item.title}
        </h3>

       <div className="mt-auto text-xs text-gray-500 text-right">
  {timeAgoTR(item.published_at ?? item.created_at)}
</div>

      </div>

      {blocked && (
        <div
          className="absolute inset-0 bg-pink-600/60 z-20 flex items-center justify-center"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onBlocked();
          }}
        >
          <span className="bg-white text-pink-700 px-4 py-2 rounded-full font-bold">
            Çocuklara uygun değil
          </span>
        </div>
      )}
    </div>
  );

  if (blocked) return Card;

  return <Link href={href}>{Card}</Link>;
}
