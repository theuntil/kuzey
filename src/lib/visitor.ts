export function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "";

  const key = "visitor_id";
  let id = localStorage.getItem(key);

  if (!id) {
    id = generateUUID();
    localStorage.setItem(key, id);
  }

  return id;
}

/* 🔐 UUID generator – Safari safe */
function generateUUID(): string {
  // Modern tarayıcılar
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // 🔁 Fallback (RFC4122 v4)
  let uuid = "";
  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      uuid += "-";
    } else if (i === 14) {
      uuid += "4";
    } else {
      const r = Math.random() * 16 | 0;
      uuid += (i === 19 ? (r & 0x3) | 0x8 : r).toString(16);
    }
  }
  return uuid;
}


/**
 * VISITOR IDENTIFIER (ANONYMOUS USER ID)
 * --------------------------------------------------
 * Kullanıcı girişi olmadan ziyaretçileri ayırt etmek için kullanılır.
 *
 * Ne yapar?
 * - Tarayıcıya özel, kalıcı bir visitor_id üretir
 * - localStorage içinde saklar
 * - Aynı tarayıcıdan gelen ziyaretçiye her zaman aynı ID'yi verir
 *
 * Nerede kullanılır?
 * - Like sistemi
 * - Yorum sistemi (gerekirse)
 * - Ziyaretçi bazlı limitler
 *
 * Neden gerekli?
 * - Login sistemi yok
 * - Ama kullanıcı davranışı takip edilmek isteniyor
 * - Aynı kişinin aynı haberi tekrar tekrar beğenmesi engelleniyor
 *
 * Notlar:
 * - SADECE client-side çalışır
 * - SSR sırasında boş string döner
 * - UUID üretimi Safari ve eski tarayıcılarla uyumludur
 */
