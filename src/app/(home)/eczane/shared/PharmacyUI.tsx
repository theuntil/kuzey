"use client";
import { useAutoPageView } from "@/lib/analytics/useAutoPageView";

import { useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  MapPin,
  Phone,
  Search,
  ShieldPlus,
  Clock,
  Building2,
} from "lucide-react";
import type { PharmacyPayload } from "./data";
import type { CityItem } from "./cities";

function mapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function telUrl(phone: string) {
  const clean = phone.replace(/[^\d+]/g, "");
  return `tel:${clean}`;
}

function normalizeTR(s: string) {
  return (s ?? "")
    .trim()
    .toLowerCase()
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c");
}

function decodeHtmlEntities(input: string) {
  return (input ?? "")
    .replaceAll("&apos;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&quot;", '"')
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}


function isMerkezDistrict(d: string) {
  const x = normalizeTR(d);
  return (
    x.includes("merkez") ||
    x.includes("central") ||
    x === "merkez ilce" ||
    x === "merkez ilçe"
  );
}

export default function PharmacyUI({
  citySlug,
  cityLabel,
  payload,
  allCities,
}: {
  citySlug: string;
  cityLabel: string;
  payload: PharmacyPayload;
  allCities: CityItem[];
}) {
   useAutoPageView();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // soft mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // districts
  const districts = useMemo(() => {
    const set = new Map<string, string>(); // normalized -> original
    for (const p of payload.pharmacies) {
      const label = (p.district ?? "").trim();
      if (!label) continue;
      const key = normalizeTR(label);
      if (!set.has(key)) set.set(key, label);
    }

    const arr = Array.from(set.values());

    // Merkez'i başa al
    arr.sort((a, b) => {
      const am = isMerkezDistrict(a) ? -1 : 0;
      const bm = isMerkezDistrict(b) ? -1 : 0;
      if (am !== bm) return am - bm;
      return a.localeCompare(b, "tr");
    });

    return arr;
  }, [payload.pharmacies]);

  const defaultDistrict = useMemo(() => {
    const merkez = districts.find((d) => isMerkezDistrict(d));
    return merkez ?? districts[0] ?? null;
  }, [districts]);

  const [activeDistrict, setActiveDistrict] = useState<string | "all">("all");


useEffect(() => {
  setActiveDistrict("all");
  setQ("");
}, [citySlug]);


  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = normalizeTR(q);
    const districtKey =
      activeDistrict === "all" ? null : normalizeTR(activeDistrict);

    return payload.pharmacies.filter((p) => {
      if (districtKey) {
        const pd = normalizeTR(p.district);
        if (pd !== districtKey) return false;
      }

      if (!query) return true;

      const hay = normalizeTR(`${p.name} ${p.district} ${p.address}`);
      return hay.includes(query);
    });
  }, [q, payload.pharmacies, activeDistrict]);

  const headerDistrictText =
    activeDistrict === "all"
      ? "Tümü"
      : activeDistrict || "Tümü";

  return (
    <main className="min-h-dvh ">
      <div
        className={[
          "mx-auto w-full max-w-7xl px-4 py-6",
          "transition-all duration-500 motion-reduce:transition-none",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        ].join(" ")}
      >
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              {cityLabel} Nöbetçi Eczaneler
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
              <span className="inline-flex items-center gap-2">
                <ShieldPlus className="h-4 w-4" />
                <span className="font-medium text-zinc-700">{cityLabel}</span>
              </span>

              <span className="inline-flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span className="font-medium text-zinc-700">
                  {headerDistrictText}
                </span>
              </span>

              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="tabular-nums">{payload.updatedISO}</span>
              </span>
            </div>

            {payload.description ? (
              <p className="mt-3 text-sm text-zinc-600">{payload.description}</p>
            ) : null}
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-[380px]">
            {/* City select */}
            <div className="relative">
              <select
                value={citySlug}
                onChange={(e) => {
                  const slug = e.target.value;
                  const target = slug === "istanbul" ? "/eczane" : `/eczane/${slug}`;
                  if (pathname === target) return;
                  startTransition(() => router.push(target));
                }}
                className="h-11 w-full appearance-none rounded-xl border border-zinc-200 bg-white px-4 pr-10 text-sm font-medium text-zinc-900 shadow-sm outline-none transition focus:border-zinc-300"
              >
                {allCities.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.labelTR}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-zinc-500" />
            </div>

            {/* Search */}
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Eczane adı veya adres ara…"
                className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-4 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-300"
              />
              <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
            </div>
          </div>
        </div>

        {/* District chips */}
        <section className="mb-6">
          <div className="rounded-2xl  bg-white p-5 shadow-sm">
             <div
    className={[
      // ÇERÇEVE (üst dahil) – “üstü yok” hissini bitirir
      "rounded-2xl ",
      // iç boşluk
      "p-3",
      // mobil yatay scroll
      "overflow-x-auto whitespace-nowrap",
      // snap
      "snap-x snap-mandatory",
      // içeride chip hizası
      "flex gap-2",
      // scrollbar gizle
      "[scrollbar-width:none] [-ms-overflow-style:none]",
      // desktop: wrap olsun
      "sm:flex-wrap sm:overflow-visible sm:whitespace-normal",
    ].join(" ")}
  >
  {/* scrollbar gizlemek için */}
  <style jsx>{`
    div::-webkit-scrollbar {
      display: none;
    }
  `}</style>

              <Chip
                active={activeDistrict === "all"}
                onClick={() => setActiveDistrict("all")}
                label="Tümü"
              />

              {districts.map((d) => (
                <Chip
                  key={d}
                  active={activeDistrict !== "all" && normalizeTR(activeDistrict) === normalizeTR(d)}
                  onClick={() => setActiveDistrict(d)}
                  label={d}
                  hint={isMerkezDistrict(d) ? "Merkez" : undefined}
                />
              ))}
            </div>

           
          </div>
        </section>

        {/* List (3 columns on desktop) */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length === 0 ? (
            <div className="sm:col-span-2 lg:col-span-3 rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600 shadow-sm">
              Arama / filtre kriterine uygun eczane bulunamadı.
            </div>
          ) : (
            filtered.map((p, idx) => (
              <article
                key={`${p.name}-${p.district}-${idx}`}
                className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300"
              >
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-zinc-900">{p.name}</h2>

                  <div className="mt-2 flex flex-col gap-2 text-sm text-zinc-600">
                    <div className="inline-flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 text-zinc-500" />
                      <div className="min-w-0">
                        <p className="font-medium text-zinc-800">{p.district}</p>
                        <p className="break-words">{p.address}</p>
                      </div>
                    </div>

                   {p.important ? (
  <div className="rounded-xl bg-zinc-50 p-3 text-xs text-zinc-700 ring-1 ring-zinc-200">
    {decodeHtmlEntities(p.important)}
  </div>
) : null}

                  </div>
                </div>

                {/* Actions: same width buttons */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <a
                    href={mapsUrl(`${p.name} ${p.address}`)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:border-zinc-300"
                  >
                    <MapPin className="h-4 w-4" />
                    Yol tarifi
                  </a>

                  {p.phone ? (
                    <a
                      href={telUrl(p.phone)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
                    >
                      <Phone className="h-4 w-4" />
                      Ara
                    </a>
                  ) : (
                    <div className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-500">
                      <Phone className="h-4 w-4" />
                      Telefon yok
                    </div>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

function Chip({
  label,
  active,
  onClick,
  hint,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  hint?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium transition",
        "ring-1",
        active
          ? "bg-zinc-900 text-white ring-zinc-900/20"
          : "bg-white text-zinc-700 ring-zinc-200 hover:ring-zinc-300",
      ].join(" ")}
    >
      <span>{label}</span>
      {hint ? (
        <span
          className={[
            "rounded-full px-2 py-0.5 text-[10px] font-semibold",
            active ? "bg-white/15 text-white" : "bg-zinc-100 text-zinc-700",
          ].join(" ")}
        >
          {hint}
        </span>
      ) : null}
    </button>
  );
}
