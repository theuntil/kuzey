import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
    .replace(/\/$/, "");

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return [{ url: `${siteUrl}/`, lastModified: new Date() }];
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data, error } = await supabase
    .from("haberler")
    .select("slug, updated_at, published_at")
    .order("published_at", { ascending: false })
    .limit(50000);

  if (error) {
    return [
      { url: `${siteUrl}/`, lastModified: new Date() },
      { url: `${siteUrl}/en`, lastModified: new Date() },
    ];
  }

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: new Date() },
    { url: `${siteUrl}/en`, lastModified: new Date() },
  ];

  const newsUrls: MetadataRoute.Sitemap = (data ?? []).flatMap((n) => {
    const last = n.updated_at || n.published_at || new Date().toISOString();
    return [
      { url: `${siteUrl}/${n.slug}`, lastModified: new Date(last) },
      { url: `${siteUrl}/en/${n.slug}`, lastModified: new Date(last) },
    ];
  });

  return [...staticUrls, ...newsUrls];
}
