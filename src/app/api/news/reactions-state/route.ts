/**
 * NEWS REACTIONS STATE API
 * --------------------------------------------------
 * Bir haber için reaction listesini ve
 * kullanıcının aktif reaction bilgisini döner.
 *
 * Endpoint:
 *   POST /api/news/reactions
 */

import "server-only";
import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/server/supabase";

export async function POST(req: Request) {
  const supabase = getSupabaseServer();

  try {
    const { newsId, visitorId } = await req.json();

    if (!newsId || !visitorId) {
      return NextResponse.json([]);
    }

    const { data, error } = await supabase
      .from("news_reactions")
      .select("reaction, visitor_id")
      .eq("news_id", newsId);

    if (error || !data) {
      console.error(error);
      return NextResponse.json([]);
    }

    const map = new Map<
      string,
      { count: number; active: boolean }
    >();

    for (const row of data) {
      const prev = map.get(row.reaction) ?? {
        count: 0,
        active: false,
      };

      map.set(row.reaction, {
        count: prev.count + 1,
        active:
          row.visitor_id === visitorId || prev.active,
      });
    }

    const reactions = Array.from(map.entries()).map(
      ([reaction, info]) => ({
        reaction,
        count: info.count,
        active: info.active,
      })
    );

    return NextResponse.json(reactions);
  } catch (err) {
    console.error(err);
    return NextResponse.json([]);
  }
}
