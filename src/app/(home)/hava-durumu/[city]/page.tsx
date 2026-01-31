import type { Metadata } from "next";
import WeatherPage from "../shared/WeatherPage";
import { fromSlugOrNull, toSlug } from "../shared/utils";


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
    title: `${titleCity} Hava Durumu | 6 Günlük Tahmin`,
    description: `${titleCity} için güncel hava durumu ve 6 günlük tahmin.`,
    alternates: {
      canonical:
        cityObj?.slug && cityObj.slug !== "istanbul"
          ? `/hava-durumu/${cityObj.slug}`
          : "/hava-durumu",
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  return <WeatherPage citySlug={city} />;
}
