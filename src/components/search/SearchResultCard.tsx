"use client";

import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { CATEGORY_MAP, CategoryKey } from "@/lib/categories";

const STORAGE =
  "https://supabase.kuzeybatihaber.cloud/storage/v1/object/public/news/";
const PLACEHOLDER = "/1.jpg";

function resolveImage(src: string | null) {
  if (!src) return PLACEHOLDER;
  if (src.startsWith("http")) return src;
  return STORAGE + src.replace(/^\/+/, "");
}

function timeAgoTR(date?: string | null) {
  if (!date) return "";
  const d = new Date(date);
  const diff = Date.now() - d.getTime();
  const h = Math.floor(diff / 36e5);
  if (h < 1) return "Az önce";
  if (h < 24) return `${h} sa önce`;
  return `${Math.floor(h / 24)} gün önce`;
}

function findCategoryKey(cat?: string | null): CategoryKey {
  if (!cat) return "genel";
  return (
    (Object.keys(CATEGORY_MAP) as CategoryKey[]).find(
      (k) =>
        CATEGORY_MAP[k].label_tr.toLocaleUpperCase("tr-TR") ===
        cat.toLocaleUpperCase("tr-TR")
    ) ?? "genel"
  );
}

export default function SearchResultCard({
  item,
  blocked,
  onBlocked,
}: {
  item: any;
  blocked: boolean;
  onBlocked: () => void;
}) {
  const key = findCategoryKey(item.category);
  const href = `/${CATEGORY_MAP[key].tr}/${item.slug}`;

  const Card = (
    <div
      className={clsx(
        "relative h-full rounded-2xl bg-white overflow-hidden",
        "shadow-[0_10px_30px_rgba(0,0,0,0.08)]",
        "transition hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
      )}
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={resolveImage(item.image_url)}
          alt={item.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4 flex flex-col gap-2">
        <span className="text-xs text-gray-500">
          {timeAgoTR(item.published_at ?? item.created_at)}
        </span>

        <h3 className="font-bold text-sm line-clamp-3">
          {item.title_ai ?? item.title}
        </h3>
      </div>

      {blocked && (
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onBlocked();
          }}
          className="absolute inset-0 bg-pink-600/60 flex items-center justify-center z-20"
        >
          <span className="bg-white px-4 py-2 rounded-full font-bold text-pink-700">
            Çocuklara uygun değil
          </span>
        </div>
      )}
    </div>
  );

  if (blocked) return Card;
  return <Link href={href}>{Card}</Link>;
}
