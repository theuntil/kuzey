import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { CATEGORY_MAP, CategoryKey } from "@/lib/categories";

const PAGE_SIZE = 9;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const key = searchParams.get("key") as CategoryKey;
  const offset = Number(searchParams.get("offset") ?? 0);

  if (!key || !CATEGORY_MAP[key]) {
    return NextResponse.json([]);
  }

  const from = offset;
  const to = offset + PAGE_SIZE - 1;

  const dbValue = CATEGORY_MAP[key].label_tr.toLocaleUpperCase("tr-TR");

  const { data, error } = await supabaseServer
    .from("haberler")
    .select(
      "id, slug, title, title_ai, image_url, category, published_at, created_at, is_child_safe"
    )
    .eq(CATEGORY_MAP[key].city ? "city" : "category", dbValue)
    .order("published_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("[category-feed]", error);
    return NextResponse.json([]);
  }

  return NextResponse.json(data ?? []);
}
