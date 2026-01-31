import { notFound, redirect } from "next/navigation";
import PrayerUI from "./PrayerUI";
import { CITIES, fromSlugOrNull, toSlug } from "./cities";
import { getPrayerPayloadByCityTR } from "./data";

function getDefaultCity() {
  return CITIES.find((c) => c.slug === "istanbul") ?? null;
}

export default async function PrayerTimesPage({
  citySlug,
}: {
  citySlug: string | null;
}) {
  // /namaz
  if (!citySlug) {
    const city = getDefaultCity();
    if (!city) notFound();

    const payload = await getPrayerPayloadByCityTR(city.apiCityTR);
    if (!payload) notFound();

    return (
      <PrayerUI
        citySlug={city.slug}
        cityLabel={city.labelTR}
        payload={payload}
        allCities={CITIES.map((c) => ({
          slug: c.slug,
          label: c.labelTR,
        }))}
      />
    );
  }

  // /namaz/[city]
  const normalized = toSlug(citySlug);

  if (normalized !== citySlug) {
    redirect(normalized === "istanbul" ? "/namaz" : `/namaz/${normalized}`);
  }

  const city = fromSlugOrNull(normalized);
  if (!city) notFound();

  const payload = await getPrayerPayloadByCityTR(city.apiCityTR);
  if (!payload) notFound();

  return (
    <PrayerUI
      citySlug={city.slug}
      cityLabel={city.labelTR}
      payload={payload}
      allCities={CITIES.map((c) => ({
        slug: c.slug,
        label: c.labelTR,
      }))}
    />
  );
}
