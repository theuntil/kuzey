"use client";
import { useAutoPageView } from "@/lib/analytics/useAutoPageView";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import SearchResultCard from "./SearchResultCard";
import SearchSkeleton from "./SearchSkeleton";
import { useChildModeStore } from "@/store/childModeStore";
import { useToast } from "@/components/ui/ToastProvider";

export type SearchItem = {
  id: string;
  slug: string;
  title: string;
  title_ai: string | null;
  image_url: string | null;
  category: string | null;
  published_at: string | null;
  created_at: string | null;
  is_child_safe: boolean;
};

export default function SearchPage() {
 useAutoPageView();
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);

  const childMode = useChildModeStore((s) => s.enabled);
  const { show } = useToast();

  /* İlk girişte: İlginizi çekebilir */
  useEffect(() => {
    loadInitial();
  }, []);

  function loadInitial() {
    setLoading(true);
    fetch("/api/search?initial=1", { cache: "no-store" })
      .then((r) => r.json())
      .then(setItems)
      .finally(() => setLoading(false));
  }

  function handleSearch(value: string) {
    setQuery(value);

    if (!value.trim()) {
      loadInitial();
      return;
    }

    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(value)}`, {
      cache: "no-store",
    })
      .then((r) => r.json())
      .then(setItems)
      .finally(() => setLoading(false));
  }

  function clearSearch() {
    setQuery("");
    loadInitial();
  }

  function blockedToast() {
    show("Bu içeriği görmek için çocuk modunu kapatın", "error");
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="flex items-center gap-3 bg-gray-100 rounded-2xl px-5 py-4">
          <Search size={20} className="text-gray-500 shrink-0" />

          <input
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Haber başlığı ara..."
            className="flex-1 bg-transparent outline-none text-sm"
          />

          {query && (
            <button
              onClick={clearSearch}
              className="p-1 rounded-full hover:bg-white transition"
              aria-label="Temizle"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* BAŞLIK */}
      {!query && (
        <h2 className="font-extrabold text-lg mb-4">
          İlginizi çekebilir
        </h2>
      )}

      {query && !loading && items.length === 0 && (
        <div className="text-center text-gray-500 py-16">
          Sonuç bulunamadı
        </div>
      )}

      {/* RESULTS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-fr">
        {loading &&
          Array.from({ length: 8 }).map((_, i) => (
            <SearchSkeleton key={`sk-${i}`} />
          ))}

        {!loading &&
          items.map((item, i) => (
            <SearchResultCard
              key={`${item.id}-${i}`}
              item={item}
              blocked={childMode && item.is_child_safe === false}
              onBlocked={blockedToast}
            />
          ))}
      </div>
    </main>
  );
}
