/**
 * NEWS DETAIL API
 * --------------------------------------------------
 * Tek bir haberin detayını getiren backend endpoint.
 *
 * Endpoint:
 *   GET /api/news?slug=haber-slug
 *
 * Ne yapar?
 * - Slug ile haberi Supabase'den çeker
 * - JSON olarak frontend'e döner
 *
 * Kim kullanır?
 * - page.tsx (Server Component)
 *
 * Not:
 * - page.tsx Supabase'e DOĞRUDAN bağlanmaz
 * - Bu route, backend ile frontend arasındaki köprüdür
 */


import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json(
      { error: "slug required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseServer
    .from("haberler")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json(
      { error: "not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}
