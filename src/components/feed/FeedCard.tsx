"use client";

import Image from "next/image";
import clsx from "clsx";

/* ---------- IMAGE RESOLVER ---------- */

// Supabase public bucket
const STORAGE =
  "https://supabase.kuzeybatihaber.cloud/storage/v1/object/public/news/";

function resolveImage(src: string | null) {
  if (!src) return "/placeholder.jpg"; // ✅ LOCAL
  if (src.startsWith("http")) return src;
  return STORAGE + src.replace(/^\/+/, "");
}

/* ---------- COMPONENT ---------- */

export default function FeedCard({
  item,
}: {
  item: {
    slug: string;
    title: string;
    image_url: string | null;
    is_child_safe: boolean;
  };
}) {
  const childMode = true; // sonra bağlarsın
  const blocked = childMode && item.is_child_safe === false;

  return (
    <div
      className={clsx(
        "rounded-2xl overflow-hidden border bg-white transition-all duration-300",
        blocked
          ? "opacity-40 cursor-not-allowed"
          : "hover:-translate-y-1 hover:shadow-lg cursor-pointer"
      )}
      onClick={() => {
        if (!blocked) location.href = `/${item.slug}`;
      }}
    >
      <div className="relative aspect-[4/3] bg-neutral-100">
        <Image
          src={resolveImage(item.image_url)}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover"
          priority={false}
        />
      </div>

      <div className="p-3">
        <h3 className="font-bold text-sm line-clamp-2">
          {item.title}
        </h3>
      </div>
    </div>
  );
}
