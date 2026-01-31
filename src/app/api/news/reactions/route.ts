/**
 * NEWS REACTION ACTION API
 * --------------------------------------------------
 * Bir haber için reaction (emoji vb.) toggle işlemi yapar.
 *
 * Endpoint:
 *   POST /api/news/reaction
 */

import "server-only";
import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/server/supabase";

export async function POST(req: Request) {
  const supabase = getSupabaseServer();

  try {
    const { newsId, visitorId, reaction } = await req.json();

    if (!newsId || !visitorId || !reaction) {
      return NextResponse.json(
        { error: "bad request" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.rpc(
      "toggle_news_reaction",
      {
        p_news_id: newsId,
        p_visitor_id: visitorId,
        p_reaction: reaction,
      }
    );

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: "rpc failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "server error" },
      { status: 500 }
    );
  }
}
