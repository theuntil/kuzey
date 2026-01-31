import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const initial = searchParams.get("initial");

  let query = supabaseServer
    .from("haberler")
    .select(
      "id, slug, title, title_ai, image_url, category, published_at, created_at, is_child_safe"
    )
    .order("published_at", { ascending: false })
    .limit(24);

  if (initial) query = query.eq("category", "ASAYİŞ");
  if (q) query = query.ilike("title", `%${q}%`);

  const { data } = await query;
  return NextResponse.json(data ?? []);
}
