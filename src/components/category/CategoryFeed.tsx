"use client";

import { useEffect, useRef, useState } from "react";
import CategoryFeedCard from "./FeedCard";
import CategoryFeedSkeleton from "./FeedCardSkeleton";
import { useAutoPageView } from "@/lib/analytics/useAutoPageView";

import Left from "@/components/LeftHome";
import { CategoryKey, CATEGORY_MAP } from "@/lib/categories";
import { useChildModeStore } from "@/store/childModeStore";
import { useToast } from "@/components/ui/ToastProvider";

export type FeedItem = {
  id: string;
  slug: string;
  title: string;
  title_ai: string | null;
  image_url: string | null;
  category: string;
  published_at: string | null;
  created_at?: string | null;
  is_child_safe: boolean;
};

export default function CategoryFeed({
  categoryKey,
  initialItems,
}: {
  categoryKey: CategoryKey;
  initialItems: FeedItem[];
}) 

{  useAutoPageView(); // 👈 KATEGORİ SAYFASI VIEW (static)
  /* ================= STATE ================= */
  const [items, setItems] = useState(initialItems);
  const [offset, setOffset] = useState(initialItems.length);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [shouldLoad, setShouldLoad] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const lockRef = useRef(false);

  const childModeEnabled = useChildModeStore((s) => s.enabled);
  const { show } = useToast();

  /* ================= LEFT CITY ================= */
  const category = CATEGORY_MAP[categoryKey];

  const leftCity =
    category?.city === true
      ? category.label_tr.toUpperCase()
      : "İSTANBUL";

  /* ================= OBSERVER ================= */
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShouldLoad(true);
      },
      { rootMargin: "1400px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!shouldLoad || !hasMore || lockRef.current) return;

    lockRef.current = true;
    setLoading(true);

    fetch(`/api/category-feed?key=${categoryKey}&offset=${offset}`, {
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((data: FeedItem[]) => {
        if (!Array.isArray(data) || data.length === 0) {
          setHasMore(false);
          return;
        }

        setItems((prev) => [...prev, ...data]);
        setOffset((prev) => prev + data.length);
      })
      .finally(() => {
        lockRef.current = false;
        setLoading(false);
        setShouldLoad(false);
      });
  }, [shouldLoad, hasMore, offset, categoryKey]);

  function handleBlocked() {
    show("Bu içeriği görmek için çocuk modunu kapatın", "error");
  }

  /* ================= RENDER ================= */
  return (
    <main className="mx-auto w-full max-w-7xl lg:max-w-[99vw] md:px-10 py-3">
      <div className="grid grid-cols-1 lg:grid-cols-[210px_1fr] gap-5 md:gap-13">

        {/* SOL */}
        <Left city={leftCity} />

        {/* SAĞ */}
        <section className="flex flex-col gap-6">
          <h1 className="text-[26px] md:text-[30px] font-extrabold tracking-tight text-black">
            {CATEGORY_MAP[categoryKey].label_tr}
          </h1>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-fr">
            {items.map((item, i) => (
              <CategoryFeedCard
                key={`${item.id}-${item.slug}-${i}`}
                item={item}
                categoryKey={categoryKey}
                blocked={childModeEnabled && item.is_child_safe === false}
                onBlocked={handleBlocked}
              />
            ))}

            {loading &&
              Array.from({ length: 6 }).map((_, i) => (
                <CategoryFeedSkeleton key={`sk-${i}`} />
              ))}
          </div>

          <div ref={sentinelRef} className="h-24" />
        </section>
      </div>
    </main>
  );
}
