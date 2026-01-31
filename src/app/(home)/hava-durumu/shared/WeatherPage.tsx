import { notFound, redirect } from "next/navigation";
import WeatherUI from "./WeatherUI";
import { ALL_CITIES } from "./cities";
import { fromSlugOrNull, toSlug } from "./utils";
import { getWeatherByCity } from "./data";

function getDefaultCity() {
  // İstanbul yoksa ilk şehre düş
  return ALL_CITIES.find((c) => c.slug === "istanbul") ?? ALL_CITIES[0] ?? null;
}

export default async function WeatherPage({
  citySlug,
}: {
  citySlug: string | null;
}) {
  // /hava-durumu
  if (!citySlug) {
    const city = getDefaultCity();
    if (!city) notFound();

    const payload = await getWeatherByCity(city.apiName, city.country);
    if (!payload) notFound();

    return (
      <WeatherUI
        citySlug={city.slug}
        cityLabel={city.labelTR}
        payload={payload}
        allCities={ALL_CITIES.map((c) => ({
          slug: c.slug,
          label: c.labelTR,
        }))}
      />
    );
  }

  // /hava-durumu/[city]
  const normalized = toSlug(citySlug);

  if (normalized !== citySlug) {
    redirect(
      normalized === "istanbul"
        ? "/hava-durumu"
        : `/hava-durumu/${normalized}`
    );
  }

  const city = fromSlugOrNull(normalized);
  if (!city) notFound();

  const payload = await getWeatherByCity(city.apiName, city.country);
  if (!payload) notFound();

  return (
    <WeatherUI
      citySlug={city.slug}
      cityLabel={city.labelTR}
      payload={payload}
      allCities={ALL_CITIES.map((c) => ({
        slug: c.slug,
        label: c.labelTR,
      }))}
    />
  );
}
