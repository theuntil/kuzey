export function radiusForMag(mag: number) {
  const r = 4 + mag * 2.2;
  return Math.max(5, Math.min(18, r));
}

export function fillForMag(mag: number) {
  if (mag >= 6) return "#dc2626";
  if (mag >= 5) return "#f97316";
  if (mag >= 4) return "#f59e0b";
  return "#18181b";
}

export function labelForMagTR(mag: number) {
  if (mag >= 6) return "Çok Şiddetli";
  if (mag >= 5) return "Şiddetli";
  if (mag >= 4) return "Orta";
  if (mag >= 3) return "Hafif";
  return "Düşük";
}

export function formatTRDateTime(isoLike: string) {
  const d = new Date(isoLike.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return isoLike;
  return d.toLocaleString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
