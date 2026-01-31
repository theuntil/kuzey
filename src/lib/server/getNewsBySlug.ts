import { supabaseServer } from "@/lib/supabase/server";
import type { NewsRow } from "@/types/news";


export async function getNewsBySlug(slug: string): Promise<NewsRow | null> {
  const { data, error } = await supabaseServer
    .from("haberler")
    .select(`
      ai_status,
      id,
      title,
      title_ai,
      title_en,
      content,
      summary,
      slug,
      keywords,
      city,
      video_url,
      has_video,
      summary_en,
      content_ai,
      content_en,
      image_url,
      published_at,
      source_name,
      category,
      is_child_safe
    `)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[getNewsBySlug] error:", error);
    return null;
  }

  return (data as any) ?? null;
}
