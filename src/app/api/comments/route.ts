import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

/* 🔒 Supabase client build-time değil runtime'da oluşturulur */
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase env missing");
  }

  return createClient(url, key);
}

/* GET COMMENTS */
export async function GET(req: Request) {
  const supabase = getSupabase();

  const newsId = new URL(req.url).searchParams.get("newsId");
  if (!newsId) {
    return NextResponse.json({ comments: [] });
  }

  const { data } = await supabase
    .from("comments")
    .select("id,name,content,created_at")
    .eq("news_id", newsId)
    .order("created_at", { ascending: true });

  return NextResponse.json({ comments: data ?? [] });
}

/* POST COMMENT */
export async function POST(req: Request) {
  const supabase = getSupabase();

  const { news_id, name, content } = await req.json();
  let visitor_id = (await cookies()).get("visitor_id")?.value;

  if (!visitor_id) visitor_id = crypto.randomUUID();

  /* 1️⃣ BOŞ ALAN */
  if (!name?.trim() || !content?.trim()) {
    return NextResponse.json({ code: "EMPTY" }, { status: 400 });
  }

  /* 2️⃣ ZATEN BANLI MI? */
  const { data: ban } = await supabase
    .from("comment_bans")
    .select("visitor_id")
    .eq("visitor_id", visitor_id)
    .maybeSingle();

  if (ban) {
    return NextResponse.json({ code: "BANNED" }, { status: 403 });
  }

  /* 3️⃣ YASAKLI KELİME KONTROLÜ (AD + YORUM) */
  const { data: bannedWords } = await supabase
    .from("banned_words")
    .select("word");

  const lowerName = name.toLowerCase();
  const lowerContent = content.toLowerCase();

  const foundBadWord = bannedWords?.some((bw) => {
    const w = bw.word.toLowerCase();
    return lowerName.includes(w) || lowerContent.includes(w);
  });

  if (foundBadWord) {
    // 🔥 KALICI BAN
    await supabase.from("comment_bans").insert({
      visitor_id,
      reason: "banned_word",
    });

    return NextResponse.json(
      { code: "BANNED_WORD" },
      { status: 403 }
    );
  }

  /* 4️⃣ 3 YORUM LİMİTİ */
  const { count } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("news_id", news_id)
    .eq("visitor_id", visitor_id);

  if ((count ?? 0) >= 3) {
    return NextResponse.json({ code: "LIMIT" }, { status: 403 });
  }

  /* 5️⃣ INSERT */
  const { data, error } = await supabase
    .from("comments")
    .insert({
      news_id,
      visitor_id,
      name,
      content,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ code: "ERROR" }, { status: 500 });
  }

  const res = NextResponse.json({
    success: true,
    newId: data.id,
  });

  res.cookies.set("visitor_id", visitor_id, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return res;
}
