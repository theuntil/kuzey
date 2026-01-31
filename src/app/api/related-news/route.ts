// app/api/related/route.ts  (örnek path)
import "server-only";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/* 🔒 SADECE BU ROUTE İÇİN (ANON) */
function getSupabaseAnon() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    throw new Error("Supabase anon env missing");
  }

  return createClient(url, anon);
}

export async function GET(req: Request) {
  const supabase = getSupabaseAnon();

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const exclude = searchParams.get("exclude");
  const limit = Number(searchParams.get("limit") || "6");

  if (!category) {
    return NextResponse.json([]);
  }

  const FETCH_LIMIT = limit + 5;

  let q = supabase
    .from("haberler")
    .select(
      "id, slug, title, title_en, image_url, published_at"
    )
    .eq("category", category)
    .order("published_at", { ascending: false })
    .limit(FETCH_LIMIT);

  if (exclude) {
    q = q.neq("slug", exclude);
  }

  const { data, error } = await q;

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json((data ?? []).slice(0, limit), {
    headers: {
      "Cache-Control": "s-maxage=60, stale-while-revalidate=30",
    },
  });
}
