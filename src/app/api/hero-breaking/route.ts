// app/api/breaking/route.ts  (örnek path)
import "server-only";
import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/server/supabase";

export async function GET() {
  const supabase = getSupabaseServer();

  const { data } = await supabase
    .from("haberler")
    .select(
      "id, slug, title, title_ai, title_en, image_url, category, published_at, is_child_safe"
    )
    .eq("son_dakika", true)
    .order("published_at", { ascending: false })
    .limit(7);

  return NextResponse.json(data ?? []);
}
