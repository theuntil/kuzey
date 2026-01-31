"use client";

import { useEffect, useRef, useState } from "react";
import FeedCard from "./FeedCard";
import { FeedItem } from "./HomePageClient";

type Props = {
  title: string;
  items: FeedItem[];
  lang: "tr" | "en";
};

export default function HomeSectionHorizontal({
  title,
  items,
  lang,
}: Props) {
  if (!items || items.length === 0) return null;

  const scrollRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;

    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  };

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollState(); // initial

    el.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  return (
    <section className="flex flex-col gap-4 w-full">
      {/* BAŞLIK */}
      <h2 className="text-[22px] md:text-[28px] font-extrabold">
        {title}
      </h2>

      {/* SCROLL ALANI */}
      <div className="relative w-full">
        {/* SOL OK – SADECE GEREKİRSE */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="
              absolute left-2 top-1/2 -translate-y-1/2 z-20
              flex items-center justify-center
              h-9 w-9 md:h-12 md:w-12
              rounded-full
              glass-overlay
              active:scale-95 hover:scale-105 transition
            "
          >
            <span className="text-sm md:text-lg">←</span>
          </button>
        )}

        {/* SAĞ OK – SADECE GEREKİRSE */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="
              absolute right-2 top-1/2 -translate-y-1/2 z-20
              flex items-center justify-center
              h-9 w-9 md:h-12 md:w-12
              rounded-full
              glass-overlay
              active:scale-95 hover:scale-105 transition
            "
          >
            <span className="text-sm md:text-lg">→</span>
          </button>
        )}

        {/* KARTLAR */}
        <div
          ref={scrollRef}
          className="
            flex gap-4
            overflow-x-auto overflow-y-hidden
            hide-scrollbar
            overscroll-x-contain
            pb-2
          "
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="
                min-w-[240px] max-w-[240px]
                sm:min-w-[260px] sm:max-w-[260px]
                shrink-0
              "
            >
              <FeedCard item={item} lang={lang} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
