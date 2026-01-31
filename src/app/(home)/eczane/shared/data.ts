import { unstable_cache } from "next/cache";

export type PharmacyItem = {
  name: string;
  district: string;
  address: string;
  phone: string | null;
  important?: string | null;
};

export type PharmacyPayload = {
  city: string;
  description?: string;
  updatedISO: string; // YYYY-MM-DD
  pharmacies: PharmacyItem[];
};

type ApiResponse = {
  data?: {
    description?: string;
    pharmacies?: Array<{
      name: string;
      district: string;
      address: string;
      phone?: string;
      important?: string;
    }>;
  };
};

function ymdLocal() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function toCityParam(citySlug: string) {
  // API endpoint şehir adı: istanbul, ankara...
  return citySlug.trim().toLowerCase();
}

async function fetchPharmacies(citySlug: string): Promise<PharmacyPayload | null> {
  const cityParam = toCityParam(citySlug);

  const url = `https://api-three-chi-43.vercel.app/api/pharmacy/${encodeURIComponent(
    cityParam
  )}?api_key=kanews-theme`;

  const res = await fetch(url, {
    cache: "no-store",
    headers: { accept: "application/json" },
  });

  if (!res.ok) return null;

  const json = (await res.json()) as ApiResponse;
  const pharmaciesRaw = json?.data?.pharmacies;

  if (!Array.isArray(pharmaciesRaw) || pharmaciesRaw.length === 0) return null;

  const pharmacies: PharmacyItem[] = pharmaciesRaw.map((p) => ({
    name: p.name,
    district: p.district,
    address: p.address,
    phone: p.phone ?? null,
    important: p.important ?? null,
  }));

  return {
    city: citySlug,
    description: json?.data?.description,
    updatedISO: ymdLocal(),
    pharmacies,
  };
}

// 10 dk cache (istersen gün bazlı yapmak için key'e ymdLocal ekleriz)
const getPharmaciesCached = unstable_cache(
  async (citySlug: string) => fetchPharmacies(citySlug),
  ["pharmacy-payload-v1"],
  { revalidate: 60 * 10, tags: ["pharmacy"] }
);

export async function getPharmaciesByCity(citySlug: string) {
  return getPharmaciesCached(citySlug);
}
