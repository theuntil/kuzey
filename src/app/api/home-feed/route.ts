import "server-only";
import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/server/supabase";

const FIELDS = `
  id, slug, title, title_ai, title_en,
  image_url, video_url,
  category, city,
  published_at, is_child_safe
`;

async function pick(col: "category" | "city", value: string) {
  const supabase = getSupabaseServer();

  const { data, error } = await supabase
    .from("haberler")
    .select(FIELDS)
    .eq(col, value)
    .order("published_at", { ascending: false })
    .limit(6);

  if (error) {
    console.error("home-feed pick error:", col, value, error.message);
    return [];
  }

  return data ?? [];
}

export async function GET() {
  try {
    const supabase = getSupabaseServer();

    const [
      politika,
      spor,
      asayis,
      ekonomi,
      saglik,
      istanbul,
      ankara,
      izmir,
      videos,
    ] = await Promise.allSettled([
      pick("category", "POLİTİKA"),
      pick("category", "SPOR"),
      pick("category", "ASAYİŞ"),
      pick("category", "EKONOMİ"),
      pick("category", "SAĞLIK"),
      pick("city", "İSTANBUL"),
      pick("city", "ANKARA"),
      pick("city", "İZMİR"),
      supabase
        .from("haberler")
        .select(FIELDS)
        .not("video_url", "is", null)
        .neq("video_url", "")
        .order("published_at", { ascending: false })
        .limit(6)
        .then(r => r.data ?? []),
    ]);

    const safe = (r: PromiseSettledResult<any>) =>
      r.status === "fulfilled" ? r.value : [];

    return NextResponse.json(
      {
        politika: safe(politika),
        videos: safe(videos),
        spor: safe(spor),
        asayis: safe(asayis),
        ekonomi: safe(ekonomi),
        saglik: safe(saglik),
        istanbul: safe(istanbul),
        ankara: safe(ankara),
        izmir: safe(izmir),
      },
      {
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (e) {
    console.error("home-feed fatal error:", e);
    return NextResponse.json(
      { error: "home-feed failed" },
      { status: 500 }
    );
  }
}
