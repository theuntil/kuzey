import { CATEGORY_MAP, CategoryKey } from "@/lib/categories";

function trUpper(input: string) {
  return input
    .trim()
    .replace(/i/g, "İ")
    .replace(/ı/g, "I")
    .replace(/ğ/g, "Ğ")
    .replace(/ü/g, "Ü")
    .replace(/ş/g, "Ş")
    .replace(/ö/g, "Ö")
    .replace(/ç/g, "Ç")
    .toUpperCase();
}

export function resolveCategoryOrCity(
  slug: string,
  lang: "tr" | "en"
): CategoryKey | null {
  const s = slug.trim().toLowerCase();
  const keys = Object.keys(CATEGORY_MAP) as CategoryKey[];

  for (const k of keys) {
    const m = CATEGORY_MAP[k];
    if (m.tr === s || m.en === s) return k;
  }

  return null;
}

export function dbLabelForKey(key: CategoryKey) {
  // DB’de hem category hem city TR string tutuluyor (uppercase)
  return trUpper(CATEGORY_MAP[key].label_tr);
}
