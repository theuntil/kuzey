import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

const CACHE_SECONDS = 300; // 5 dk

export async function GET() {
  const { data, error } = await supabaseServer
    .from("reklamlar")
    .select("id, image_path, redirect_url")
    .limit(200);

  if (error) {
    return NextResponse.json([], {
      status: 500,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }

  return NextResponse.json(data ?? [], {
    status: 200,
    headers: {
      // ✅ API için DOĞRU cache yöntemi
      "Cache-Control": `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${CACHE_SECONDS * 2}`,
    },
  });
}
