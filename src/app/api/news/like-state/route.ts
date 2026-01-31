/**
 * NEWS LIKE STATE API
 * --------------------------------------------------
 * Bir haberin mevcut like durumunu okur.
 *
 * Endpoint:
 *   POST /api/news/like-state
 */

import "server-only";
import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/server/supabase";

export async function POST(req: Request) {
  const supabase = getSupabaseServer();

  const { newsId, visitorId } = await req.json();

  if (!newsId || !visitorId) {
    return NextResponse.json({
      liked: false,
      count: 0,
    });
  }

  /* TOPLAM LIKE SAYISI */
  const { count } = await supabase
    .from("news_likes")
    .select("*", { count: "exact", head: true })
    .eq("news_id", newsId);

  /* BU KULLANICI LIKE ATMIŞ MI */
  const { data } = await supabase
    .from("news_likes")
    .select("id")
    .eq("news_id", newsId)
    .eq("visitor_id", visitorId)
    .maybeSingle();

  return NextResponse.json({
    liked: !!data,
    count: count ?? 0,
  });
}
