// src/app/(home)/page.tsx

export const revalidate = 60; // ISR: 60 sn
export const dynamic = "force-static"; // build + cache dostu

import HomePageClient from "@/components/home/HomePageClient";
import { getHomeFeed } from "@/lib/getHomeFeed";

export default async function Page() {
  const data = await getHomeFeed();
  return <HomePageClient data={data} lang="tr" />;
}
