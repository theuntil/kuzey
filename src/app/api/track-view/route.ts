import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const LOCK_SECONDS = 30;

function sha(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export async function POST(req: Request) {
  const res = NextResponse.json({ ok: true });

  try {
    const {
      contentType,
      contentId,
      slug,
      route,
      category,
      city,
    } = await req.json();

    if (!contentType || !route) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    /* SESSION */

    let sessionId =
      req.headers
        .get("cookie")
        ?.match(/kb_session_id=([^;]+)/)?.[1] ?? null;

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ??
      req.headers.get("x-real-ip") ??
      "0.0.0.0";

    const ua = req.headers.get("user-agent") ?? "unknown";

    if (!sessionId) {
      sessionId = crypto.randomUUID();

      await supabase.from("analytics_sessions").insert({
        id: sessionId,
        ip_hash: sha(ip),
        user_agent_hash: sha(ua),
      });

      res.cookies.set("kb_session_id", sessionId, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
    }

    /* SAME PAGE LOCK (30 SANİYE) */

    const { data: lock } = await supabase
      .from("analytics_view_locks")
      .select("locked_until")
      .eq("session_id", sessionId)
      .eq("route", route)
      .maybeSingle();

    if (lock && new Date(lock.locked_until) > new Date()) {
      return res; // refresh / double render → sayılmaz
    }

    await supabase.from("analytics_view_locks").upsert({
      session_id: sessionId,
      route,
      locked_until: new Date(
        Date.now() + LOCK_SECONDS * 1000
      ).toISOString(),
    });

    /* EVENT */

    await supabase.from("analytics_events").insert({
      event_type: "page_view",
      content_type: contentType,
      content_id: contentType === "news" ? contentId : null,
      slug,
      route,
      category_slug: category,
      city_slug: city,
      session_id: sessionId,
    });

    /* NEWS COUNTER */

    if (contentType === "news" && contentId) {
      await supabase.rpc("increment_news_views", {
        news_id: contentId,
      });
    }

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
