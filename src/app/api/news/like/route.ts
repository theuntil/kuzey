/**
 * NEWS LIKE ACTION API
 * --------------------------------------------------
 * Bir haber için like / unlike işlemini yapar.
 *
 * Endpoint:
 *   POST /api/news/like
 */

import "server-only";
import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/server/supabase";

export async function POST(req: Request) {
  const supabase = getSupabaseServer();

  const { newsId, visitorId } = await req.json();

  if (!newsId || !visitorId) {
    return NextResponse.json(
      { error: "bad request" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase.rpc("toggle_news_like", {
    p_news_id: newsId,
    p_visitor_id: visitorId,
  });

  if (error || !data?.[0]) {
    console.error(error);
    return NextResponse.json(
      { error: "rpc failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    liked: data[0].liked,
    count: data[0].like_count,
  });
}
