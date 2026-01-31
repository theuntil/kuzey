export type NewsRow = {
  id: string;
  slug: string;

  title: string;
  title_ai: string | null;
  title_en: string | null;

  content: string;
  content_ai: string | null;
  content_en: string | null;

  summary: string;
  summary_en: string | null;

  image_url: string | null;
  video_url: string | null;
  has_video: boolean;

  category: string;
  city: string | null;

  published_at: string | null;
  source_name: string | null;

  keywords: string[] | null;
  ai_status: string | null;

  is_child_safe: boolean;
};
