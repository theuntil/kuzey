import { CATEGORY_MAP, CategoryKey } from "./categories";

export function resolveCategoryFromUrl(
  slug: string,
  lang: "tr" | "en"
): CategoryKey | null {
  const entry = Object.entries(CATEGORY_MAP).find(
    ([, value]) => value[lang] === slug
  );

  return entry ? (entry[0] as CategoryKey) : null;
}


export function resolveCategory(slug: string): CategoryKey | null {
  const s = slug.toLowerCase();
  return (
    (Object.keys(CATEGORY_MAP) as CategoryKey[]).find(
      (k) => CATEGORY_MAP[k].tr === s || CATEGORY_MAP[k].en === s
    ) ?? null
  );
}

/**
 * RESOLVE CATEGORY FROM URL
 * --------------------------------------------------
 * URL'den gelen kategori slug'ını,
 * sistemde kullanılan gerçek kategori anahtarına (CategoryKey)
 * dönüştürmek için kullanılır.
 *
 * Örnek:
 *   URL: /spor/fenerbahce-haberi
 *   URL: /en/sports/fenerbahce-news
 *
 * Bu fonksiyon ne yapar?
 * - CATEGORY_MAP içindeki tanımlara bakar
 * - URL'deki slug'ı (spor / sports gibi)
 *   aktif dile (tr / en) göre eşleştirir
 * - Eşleşme varsa CategoryKey döner (örn: "spor")
 * - Eşleşme yoksa null döner
 *
 * Neden gerekli?
 * - URL yapısı dil bazlıdır (spor / sports)
 * - Veritabanı ve sistem içi kategori anahtarları tektir
 * - URL ile sistem arasındaki köprü görevini görür
 *
 * Kim kullanır?
 * - page.tsx (kategori & haber sayfaları)
 *
 * Not:
 * - Bu fonksiyon SADECE doğrulama ve eşleştirme yapar
 * - Veritabanı veya API çağrısı yapmaz
 */
