"use client";

import FeedCard from "./FeedCard";
import { FeedItem } from "./HomePageClient";

type Props = {
  title: string;
  items: FeedItem[];   // 🔥 ARTIK ZORUNLU
  lang: "tr" | "en";
};

export default function HomeSectionGrid({
  title,
  items,
  lang,
}: Props) {
  // veri yoksa section'ı hiç render etme
  if (!items || items.length === 0) return null;

  return (
    <section className="flex flex-col gap-5">
      <h2 className="text-[24px] md:text-[28px] font-extrabold">
        {title}
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {items.map((item) => (
          <FeedCard key={item.id} item={item} lang={lang} />
        ))}
      </div>
    </section>
  );
}
