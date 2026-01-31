import type { Metadata } from "next";
import PharmacyPage from "../shared/PharmacyPage";
import { fromSlugOrNull, toSlug } from "../shared/cities";

/* =======================
   METADATA (ASYNC PARAMS)
   ======================= */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;

  if (!city) {
    return {
      title: "İstanbul Nöbetçi Eczaneler | Güncel Liste",
      description:
        "İstanbul için güncel nöbetçi eczaneler: adres, telefon ve yol tarifi.",
      alternates: { canonical: "/eczane" },
    };
  }

  const normalized = toSlug(city);
  const cityObj = fromSlugOrNull(normalized);
  const titleCity = cityObj?.labelTR ?? "İstanbul";

  return {
    title: `${titleCity} Nöbetçi Eczaneler | Güncel Liste`,
    description: `${titleCity} için güncel nöbetçi eczaneler: adres, telefon ve yol tarifi.`,
    alternates: {
      canonical:
        cityObj?.slug && cityObj.slug !== "istanbul"
          ? `/eczane/${cityObj.slug}`
          : "/eczane",
    },
  };
}

/* =======================
   PAGE (ASYNC PARAMS)
   ======================= */
export default async function Page({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  return <PharmacyPage citySlug={city} />;
}
