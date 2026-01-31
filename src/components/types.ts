export type FeedItem = {
  id: string;
  slug: string;
  title: string;
  title_ai: string | null;
  title_en: string | null;
  image_url: string | null;
  category: string;
  published_at: string | null;
  created_at?: string | null;
  is_child_safe: boolean;
};
