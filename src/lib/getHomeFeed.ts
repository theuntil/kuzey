import { cache } from "react";
import { supabaseServer } from "@/lib/supabase/server";

const LIMIT_PER_GROUP = 6;
const POOL_LIMIT = 300; // 🔥 GARANTİ HAVUZ

const FIELDS = `
  id, slug, title, title_ai, title_en,
  image_url, video_url,
  category, city,
  published_at, is_child_safe
`;

type Row = {
  id: string;
  slug: string;
  title: string;
  title_ai: string | null;
  title_en: string | null;
  image_url: string | null;
  video_url: string | null;
  category: string;
  city: string | null;
  published_at: string | null;
  is_child_safe: boolean;
};

type Feed = {
  politika: Row[];
  spor: Row[];
  asayis: Row[];
  ekonomi: Row[];
  saglik: Row[];
  istanbul: Row[];
  ankara: Row[];
  izmir: Row[];
  videos: Row[];
};

export const getHomeFeed = cache(async (): Promise<Feed> => {
  const { data, error } = await supabaseServer
    .from("haberler")
    .select(FIELDS)
    .or(
      [
        "category.eq.POLİTİKA",
        "category.eq.SPOR",
        "category.eq.ASAYİŞ",
        "category.eq.EKONOMİ",
        "category.eq.SAĞLIK",
        "city.eq.İSTANBUL",
        "city.eq.ANKARA",
        "city.eq.İZMİR",
        "video_url.not.is.null",
      ].join(",")
    )
    .order("published_at", { ascending: false })
    .limit(POOL_LIMIT);

  if (error) {
    console.error("getHomeFeed fatal error:", error.message);
    return emptyFeed();
  }

  const rows = (data ?? []) as Row[];

  const feed: Feed = {
    politika: [],
    spor: [],
    asayis: [],
    ekonomi: [],
    saglik: [],
    istanbul: [],
    ankara: [],
    izmir: [],
    videos: [],
  };

  for (const r of rows) {
    if (feed.politika.length < LIMIT_PER_GROUP && r.category === "POLİTİKA")
      feed.politika.push(r);

    else if (feed.spor.length < LIMIT_PER_GROUP && r.category === "SPOR")
      feed.spor.push(r);

    else if (feed.asayis.length < LIMIT_PER_GROUP && r.category === "ASAYİŞ")
      feed.asayis.push(r);

    else if (feed.ekonomi.length < LIMIT_PER_GROUP && r.category === "EKONOMİ")
      feed.ekonomi.push(r);

    else if (feed.saglik.length < LIMIT_PER_GROUP && r.category === "SAĞLIK")
      feed.saglik.push(r);

    else if (feed.istanbul.length < LIMIT_PER_GROUP && r.city === "İSTANBUL")
      feed.istanbul.push(r);

    else if (feed.ankara.length < LIMIT_PER_GROUP && r.city === "ANKARA")
      feed.ankara.push(r);

    else if (feed.izmir.length < LIMIT_PER_GROUP && r.city === "İZMİR")
      feed.izmir.push(r);

    else if (
      feed.videos.length < LIMIT_PER_GROUP &&
      !!r.video_url &&
      r.video_url !== ""
    )
      feed.videos.push(r);

    // 🔥 Tüm gruplar dolduysa erken çık
    if (
      feed.politika.length === LIMIT_PER_GROUP &&
      feed.spor.length === LIMIT_PER_GROUP &&
      feed.asayis.length === LIMIT_PER_GROUP &&
      feed.ekonomi.length === LIMIT_PER_GROUP &&
      feed.saglik.length === LIMIT_PER_GROUP &&
      feed.istanbul.length === LIMIT_PER_GROUP &&
      feed.ankara.length === LIMIT_PER_GROUP &&
      feed.izmir.length === LIMIT_PER_GROUP &&
      feed.videos.length === LIMIT_PER_GROUP
    ) {
      break;
    }
  }

  return feed;
});

function emptyFeed(): Feed {
  return {
    politika: [],
    spor: [],
    asayis: [],
    ekonomi: [],
    saglik: [],
    istanbul: [],
    ankara: [],
    izmir: [],
    videos: [],
  };
}
