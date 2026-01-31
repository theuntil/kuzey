import { CATEGORY_MAP } from "@/lib/categories";
import { resolveCategoryFromUrl } from "@/lib/resolveCategory";

type Lang = "tr" | "en";

export function switchLangUrl(
  pathname: string,
  targetLang: Lang
) {
  const parts = pathname.split("/").filter(Boolean);

  let currentLang: Lang = "tr";
  let index = 0;

  // Dil tespiti
  if (parts[0] === "en") {
    currentLang = "en";
    index = 1;
  }

  const first = parts[index];       // ana slug
  const second = parts[index + 1];  // opsiyonel

  /* ---------------- ANASAYFA ---------------- */
  if (!first) {
    return targetLang === "en" ? "/" : "/";
  }

  /* ---------------- KATEGORİ ÇÖZ ---------------- */
  const categoryKey = resolveCategoryFromUrl(first, currentLang);

  /* ---------------- STATİK SAYFA ---------------- */
  if (!categoryKey && !second) {
    return targetLang === "en"
      ? `/en/${first}`
      : `/${first}`;
  }

  /* ---------------- BİLİNMEYEN / GÜVENSİZ ---------------- */
  if (!categoryKey) {
    return targetLang === "en" ? "/en" : "/";
  }

  const newCategorySlug = CATEGORY_MAP[categoryKey][targetLang];

  /* ---------------- SADECE KATEGORİ ---------------- */
  if (!second) {
    return targetLang === "en"
      ? `/en/${newCategorySlug}`
      : `/${newCategorySlug}`;
  }

  /* ---------------- HABER DETAY ---------------- */
  return targetLang === "en"
    ? `/en/${newCategorySlug}/${second}`
    : `/${newCategorySlug}/${second}`;
}
