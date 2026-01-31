"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Zap,
  Pill,
  Activity,
  Cloud,
  MoonStar,
  BadgeDollarSign,
} from "lucide-react";

function isEnglishPath(pathname: string) {
  return pathname === "/en" || pathname.startsWith("/en/");
}

type Item = {
  key: string;
  labelTR: string;
  labelEN: string;
  hrefTR: string;
  hrefEN: string;
  Icon: React.ComponentType<{ className?: string }>;
  chipBg: string;
  chipRing: string;
  chipText: string;
};

export default function QuickAccessWidget() {
  const pathname = usePathname() || "/";
  const isEn = isEnglishPath(pathname);

  const items = useMemo<Item[]>(
    () => [
      
      {
        key: "pharmacy",
        labelTR: "Nöbetçi Eczane",
        labelEN: "Pharmacy",
        hrefTR: "/eczane",
        hrefEN: "/eczane",
        Icon: Pill,
        chipBg: "bg-emerald-50",
        chipRing: "ring-emerald-200",
        chipText: "text-emerald-700",
      },
      {
        key: "earthquake",
        labelTR: "Son Depremler",
        labelEN: "Earthquakes",
        hrefTR: "/son-depremler",
        hrefEN: "/son-depremler",
        Icon: Activity,
        chipBg: "bg-violet-50",
        chipRing: "ring-violet-200",
        chipText: "text-violet-700",
      },
      {
        key: "weather",
        labelTR: "Hava Durumu",
        labelEN: "Weather",
        hrefTR: "/hava-durumu",
        hrefEN: "/hava-durumu",
        Icon: Cloud,
        chipBg: "bg-sky-50",
        chipRing: "ring-sky-200",
        chipText: "text-sky-700",
      },
      {
        key: "fx",
        labelTR: "Döviz",
        labelEN: "Exchange",
        hrefTR: "/piyasalar",
        hrefEN: "/piyasalar",
        Icon: BadgeDollarSign,
        chipBg: "bg-lime-50",
        chipRing: "ring-lime-200",
        chipText: "text-lime-700",
      },
    ],
    []
  );

  return (
    <section className="rounded-3xl  bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
       
       
      </div>

      {/* xs: 2 col, sm+: 3 col */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-2">
        {items.map((it) => {
          const href = isEn ? it.hrefEN : it.hrefTR;
          const label = isEn ? it.labelEN : it.labelTR;
          const Icon = it.Icon;

          return (
            <Link
              key={it.key}
              href={href}
              className={[
                "group rounded-2xl bg-white",
                "p-3 transition hover:border-zinc-300 hover:bg-zinc-50",
                "active:scale-[0.99]",
                // Kart boyunu sabitle → taşma olmaz
                "min-h-[110px] ",
                "flex flex-col items-center justify-center",
              ].join(" ")}
            >
              <div
                className={[
                  "grid place-items-center rounded-2xl ring-1",
                  // mobilde küçük, sm+ biraz büyük
                  "h-10 w-10 sm:h-11 sm:w-11",
                  it.chipBg,
                  it.chipRing,
                ].join(" ")}
              >
                <Icon className={["h-4 w-4", it.chipText].join(" ")} />
              </div>

              {/* 2 satır clamp → taşıp kartı bozmaz */}
              <div
                className={[
                  "mt-2 text-center font-semibold text-zinc-900",
                  "text-[11px] leading-snug ",
                  "line-clamp-2",
                  "break-words",
                ].join(" ")}
              >
                {label}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
