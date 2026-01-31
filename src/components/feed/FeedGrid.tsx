"use client";

import { useEffect, useRef, useState } from "react";
import { CategoryKey } from "@/lib/categories";
import FeedCard from "./FeedCard";
import FeedSkeleton from "./FeedSkeleton";

type Item = {
  id: string;
  slug: string;
  title: string;
  image_url: string | null;
  is_child_safe: boolean;
};

export default function FeedGrid({
  categoryKey,
}: {
  categoryKey: CategoryKey;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const ref = useRef<HTMLDivElement | null>(null);

  async function load() {
    if (!hasMore) return;

    const res = await fetch(
      `/api/feed?key=${categoryKey}&page=${page}`,
      { cache: "no-store" }
    );

    const data: Item[] = await res.json();

    setItems((p) => [...p, ...data]);
    setPage((p) => p + 1);
    setLoading(false);

    if (data.length < 18) setHasMore(false);
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!ref.current) return;

    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && load(),
      { rootMargin: "400px" }
    );

    io.observe(ref.current);
    return () => io.disconnect();
  }, [ref.current]);

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <FeedCard key={item.id} item={item} />
        ))}

        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <FeedSkeleton key={i} />
          ))}
      </div>

      <div ref={ref} className="h-12" />
    </>
  );
}
