"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  X,
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

  // icon veya resimden biri
  Icon?: React.ComponentType<{ className?: string }>;
  imageSrc?: string; // public içinden: "/wikipedia.png"

  chipBg: string;
  chipRing: string;
  chipText: string;
};

export default function QuickAccessMenu() {
  const pathname = usePathname() || "/";
  const isEn = isEnglishPath(pathname);

  const [open, setOpen] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [stage, setStage] = useState<"enter" | "leave">("enter");

  const wrapRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);

  const items = useMemo<Item[]>(
    () => [
      // ✅ Tarihte Bugün: ICON YOK → RESİM VAR
      {
        key: "onthisday",
        labelTR: "Tarihte Bugün",
        labelEN: "Today in History",
        hrefTR: "/tarihte-bugun",
        hrefEN: "/tarihte-bugun",
        imageSrc: "/w.png", // public/wikipedia.png
        chipBg: "bg-zinc-50",
        chipRing: "ring-zinc-200",
        chipText: "text-zinc-900",
      },
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
        key: "prayer",
        labelTR: "Namaz Vakitleri",
        labelEN: "Prayer",
        hrefTR: "/namaz",
        hrefEN: "/namaz",
        Icon: MoonStar,
        chipBg: "bg-zinc-50",
        chipRing: "ring-zinc-200",
        chipText: "text-zinc-700",
      },
      {
        key: "fx",
        labelTR: "Döviz Kurlar",
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

  // Aç/Kapa animasyon kontrolü
  useEffect(() => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }

    if (open) {
      setRendered(true);
      setStage("leave");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setStage("enter"));
      });
    } else {
      if (!rendered) return;
      setStage("leave");
      closeTimer.current = window.setTimeout(() => {
        setRendered(false);
      }, 180);
    }

    return () => {
      if (closeTimer.current) {
        window.clearTimeout(closeTimer.current);
        closeTimer.current = null;
      }
    };
  }, [open, rendered]);

  // Outside click
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!open) return;
      if (!wrapRef.current) return;
      if (wrapRef.current.contains(e.target as Node)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // ESC close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={isEn ? "Quick access" : "Hızlı erişim"}
        aria-expanded={open}
        className={[
          "rounded-xl p-2 transition",
          "hover:bg-black/5 active:scale-[0.98]",
          "focus:outline-none focus:ring-2 focus:ring-black/10",
        ].join(" ")}
      >
        <LayoutGrid className="h-5 w-5 text-black" />
      </button>

      {/* Popover */}
      {rendered && (
        <div
          className={[
            "absolute right-0 top-11 z-50",
            "w-[340px] max-w-[92vw]",
            "origin-top-right",
            "rounded-3xl border border-zinc-200 bg-white shadow-2xl",
            "p-7",
            "transition-all duration-200 ease-out",
            stage === "enter"
              ? "translate-y-0 scale-100 opacity-100"
              : "-translate-y-1 scale-[0.92] opacity-0 pointer-events-none",
          ].join(" ")}
        >
          {/* Header */}
          <div className="mb-3 flex items-center justify-between">
            <p className="text-base font-semibold text-zinc-900">
              {isEn ? "Quick Access" : "Hızlı Erişim"}
            </p>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-2 transition hover:bg-zinc-100 active:scale-[0.98]"
              aria-label={isEn ? "Close" : "Kapat"}
            >
              <X className="h-5 w-5 text-zinc-700" />
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-3 gap-3">
            {items.map((it) => {
              const href = isEn ? it.hrefEN : it.hrefTR;
              const label = isEn ? it.labelEN : it.labelTR;

              return (
                <Link
                  key={it.key}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={[
                    "group rounded-2xl border border-zinc-200 bg-white",
                    "p-3 text-center transition",
                    "hover:border-zinc-300 hover:bg-zinc-50",
                    "active:scale-[0.99]",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "mx-auto grid h-11 w-11 place-items-center rounded-2xl ring-1",
                      "overflow-hidden", // resim taşmasın
                      it.chipBg,
                      it.chipRing,
                    ].join(" ")}
                  >
                    {it.imageSrc ? (
                      <img
                        src={it.imageSrc}
                        alt=""
                        className="h-7 w-7 object-contain"
                        draggable={false}
                      />
                    ) : it.Icon ? (
                      <it.Icon className={["h-6 w-6", it.chipText].join(" ")} />
                    ) : null}
                  </div>

                  <div className="mt-2 text-[12px] font-semibold leading-tight text-zinc-900 line-clamp-2">
                    {label}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
