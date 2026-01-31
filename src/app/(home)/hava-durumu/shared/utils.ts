import { ALL_CITIES } from "./cities";

export function toSlug(input: string) {
  return (input ?? "")
    .trim()
    .toLowerCase()
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function fromSlugOrNull(slug: string) {
  const clean = toSlug(slug);
  return ALL_CITIES.find((c) => c.slug === clean) ?? null;
}
