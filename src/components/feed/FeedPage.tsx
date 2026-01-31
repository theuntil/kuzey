"use client";

import { CategoryKey, CATEGORY_MAP } from "@/lib/categories";
import FeedGrid from "./FeedGrid";

export default function FeedPage({
  categoryKey,
}: {
  categoryKey: CategoryKey;
}) {
  const meta = CATEGORY_MAP[categoryKey];

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-8">
        {meta.label_tr}
      </h1>

      <FeedGrid categoryKey={categoryKey} />
    </main>
  );
}
