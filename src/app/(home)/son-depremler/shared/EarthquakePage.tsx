import { getLatestEarthquakes } from "./data";
import EarthquakeUI from "./EarthquakeUI";

export default async function EarthquakePage() {
  const items = await getLatestEarthquakes(80);

  if (!items) {
    return (
      <div className="min-h-dvh bg-gradient-to-b from-white to-zinc-50">
        <div className="mx-auto w-full max-w-7xl px-4 py-8">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h1 className="text-lg font-semibold text-zinc-900">Son Depremler</h1>
            <p className="mt-2 text-sm text-zinc-600">
              Deprem verisi alınamadı. Lütfen daha sonra tekrar deneyin.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <EarthquakeUI items={items} />;
}
