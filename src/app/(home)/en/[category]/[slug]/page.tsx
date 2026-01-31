import { notFound } from "next/navigation";
import NewsDetail from "@/components/news/NewsDetail";
import { getNewsBySlug } from "@/lib/server/getNewsBySlug";
import { resolveCategoryOrCity } from "@/lib/resolveCategoryOrCity";

export default async function Page({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params; // 🔥 KRİTİK

  const key = resolveCategoryOrCity(category, "en");
  if (!key) notFound();

  const data = await getNewsBySlug(slug);
  if (!data) notFound();

  return <NewsDetail data={data} lang="en" />;
}
