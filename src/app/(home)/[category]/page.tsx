import { notFound } from "next/navigation";
import { CATEGORY_MAP } from "@/lib/categories";
import { resolveCategoryOrCity } from "@/lib/resolveCategoryOrCity";
import { supabaseServer } from "@/lib/supabase/server";
import CategoryFeed from "@/components/category/CategoryFeed";

const PAGE_SIZE = 9;

export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params; // 🔥 KRİTİK

  const key = resolveCategoryOrCity(category, "tr");
  if (!key || !CATEGORY_MAP[key]) notFound();

  const dbValue = CATEGORY_MAP[key].label_tr.toLocaleUpperCase("tr-TR");

  const { data } = await supabaseServer
    .from("haberler")
    .select(
      "id, slug, title, title_ai, title_en, image_url, category, published_at, created_at, is_child_safe"
    )
    .eq(CATEGORY_MAP[key].city ? "city" : "category", dbValue)
    .order("published_at", { ascending: false })
    .limit(PAGE_SIZE);

  return (
    <CategoryFeed
      categoryKey={key}
      initialItems={data ?? []}
    />
  );
}
