import { notFound, redirect } from "next/navigation";
import PharmacyUI from "./PharmacyUI";
import { CITIES, fromSlugOrNull, toSlug } from "./cities";
import { getPharmaciesByCity } from "./data";

function getDefaultCity() {
  return CITIES.find((c) => c.slug === "istanbul") ?? CITIES[0] ?? null;
}

export default async function PharmacyPage({
  citySlug,
}: {
  citySlug: string | null;
}) {
  // /eczane -> istanbul
  if (!citySlug) {
    const city = getDefaultCity();
    if (!city) notFound();

    const payload = await getPharmaciesByCity(city.slug);
    if (!payload) {
      return (
        <div className="min-h-dvh bg-gradient-to-b from-white to-zinc-50">
          <div className="mx-auto w-full max-w-6xl px-4 py-8">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h1 className="text-lg font-semibold text-zinc-900">
                Nöbetçi Eczaneler
              </h1>
              <p className="mt-2 text-sm text-zinc-600">
                Veri alınamadı. Lütfen daha sonra tekrar deneyin.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <PharmacyUI
        citySlug={city.slug}
        cityLabel={city.labelTR}
        payload={payload}
        allCities={CITIES}
      />
    );
  }

  // /eczane/[city]
  const normalized = toSlug(citySlug);

  if (normalized !== citySlug) {
    redirect(normalized === "istanbul" ? "/eczane" : `/eczane/${normalized}`);
  }

  const city = fromSlugOrNull(normalized);
  if (!city) notFound();

  const payload = await getPharmaciesByCity(city.slug);
  if (!payload) {
    return (
      <div className="min-h-dvh bg-gradient-to-b from-white to-zinc-50">
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h1 className="text-lg font-semibold text-zinc-900">
              Nöbetçi Eczaneler
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Bu şehir için veri bulunamadı. Lütfen farklı bir şehir deneyin.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PharmacyUI
      citySlug={city.slug}
      cityLabel={city.labelTR}
      payload={payload}
      allCities={CITIES}
    />
  );
}
