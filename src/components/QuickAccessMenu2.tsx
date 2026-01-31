"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Info, X, Megaphone, Handshake, Building2, ShieldCheck, Mail } from "lucide-react";

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
      {
        key: "advertising",
        labelTR: "Reklam",
        labelEN: "Advertising",
        hrefTR: "/reklam",
        hrefEN: "/reklam",
        Icon: Megaphone,
        chipBg: "bg-orange-50",
        chipRing: "ring-orange-200",
        chipText: "text-orange-700",
      },
      {
        key: "partnership",
        labelTR: "İş Birliği",
        labelEN: "Partnership",
        hrefTR: "/is-birligi",
        hrefEN: "/is-birligi",
        Icon: Handshake,
        chipBg: "bg-emerald-50",
        chipRing: "ring-emerald-200",
        chipText: "text-emerald-700",
      },
      {
        key: "about",
        labelTR: "Hakkımızda",
        labelEN: "About Us",
        hrefTR: "/kunye",
        hrefEN: "/kunye",
        Icon: Building2,
        chipBg: "bg-sky-50",
        chipRing: "ring-sky-200",
        chipText: "text-sky-700",
      },
      {
        key: "policies",
        labelTR: "Politikalar",
        labelEN: "Policies",
        hrefTR: "/politikalar",
        hrefEN: "/politikalar",
        Icon: ShieldCheck,
        chipBg: "bg-violet-50",
        chipRing: "ring-violet-200",
        chipText: "text-violet-700",
      },
      {
        key: "contact",
        labelTR: "İletişim",
        labelEN: "Contact",
        hrefTR: "/iletisim",
        hrefEN: "/iletisim",
        Icon: Mail,
        chipBg: "bg-zinc-50",
        chipRing: "ring-zinc-200",
        chipText: "text-zinc-700",
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
        aria-label={isEn ? "About Company" : "Şirket Hakkında"}
        aria-expanded={open}
        className={[
          "rounded-xl p-2 transition",
          "hover:bg-black/5 active:scale-[0.98]",
          "focus:outline-none focus:ring-2 focus:ring-black/10",
        ].join(" ")}
      >
        <Info className="h-5 w-5 text-black" />
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
              {isEn ? "Information" : "Bilgilendirme"}
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
                      it.chipBg,
                      it.chipRing,
                    ].join(" ")}
                  >
                    <it.Icon className={["h-6 w-6", it.chipText].join(" ")} />
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
