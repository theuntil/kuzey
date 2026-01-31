import type { Metadata } from "next";
import PrayerTimesPage from "../shared/PrayerTimesPage";
import { fromSlugOrNull, toSlug } from "../shared/cities";



export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;

  const normalized = toSlug(city);
  const cityObj = fromSlugOrNull(normalized);
  const titleCity = cityObj?.labelTR ?? "İstanbul";

  return {
    title: `${titleCity} Namaz Vakitleri | Güncel Saatler`,
    description: `${titleCity} için güncel namaz vakitleri.`,
    alternates: {
      canonical:
        cityObj?.slug && cityObj.slug !== "istanbul"
          ? `/namaz/${cityObj.slug}`
          : "/namaz",
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  return <PrayerTimesPage citySlug={city} />;
}
