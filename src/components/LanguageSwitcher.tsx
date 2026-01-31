"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import clsx from "clsx";

import { switchLangUrl } from "@/lib/switchLangUrl";
import { useToast } from "@/components/ui/ToastProvider";

/* ---------------- HELPERS ---------------- */

function isEnglishPath(pathname: string) {
  return pathname === "/en" || pathname.startsWith("/en/");
}

/* ---------------- COMPONENT ---------------- */

export default function LanguageSwitcher() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const toast = useToast();

  const isEn = isEnglishPath(pathname);

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* outside click */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(lang: "tr" | "en") {
    setOpen(false);

    toast.show(
      lang === "en"
        ? "Language switched to Global"
        : "Dil Türkçe olarak değiştirildi"
    );

    /* ----------- FIX START ----------- */

    let nextUrl = switchLangUrl(pathname, lang);

    // HOMEPAGE EDGE CASE FIX
    if (pathname === "/" && lang === "en") nextUrl = "/en";
    if (pathname === "/en" && lang === "tr") nextUrl = "/";

    // SAME URL GUARD
    if (nextUrl === pathname) return;

    setTimeout(() => {
      router.push(nextUrl);
    }, 150);

    /* ----------- FIX END ----------- */
  }

  /* ---------------- RENDER ---------------- */

  return (
    <div ref={dropdownRef} className="relative">
      {/* BUTTON */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm font-medium text-black/80 hover:text-black transition"
      >
        <Image
          src={isEn ? "/gb.svg" : "/tr.svg"}
          alt="Lang"
          width={20}
          height={20}
          className="rounded-sm"
        />
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-3 w-[240px] rounded-2xl bg-white shadow-xl border border-black/5 p-3 z-50">

          {/* TR */}
          <button
            onClick={() => handleSelect("tr")}
            className="flex w-full items-center justify-between rounded-xl px-4 py-3 hover:bg-black/5 transition"
          >
            <div className="flex items-center gap-3">
              <Image src="/tr.svg" alt="TR" width={20} height={20} className="rounded-sm"/>
              <span className="text-sm font-semibold uppercase">
                Türkiye
              </span>
            </div>

            {!isEn && (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </button>

          {/* EN */}
          <button
            onClick={() => handleSelect("en")}
            className="flex w-full items-center justify-between rounded-xl px-4 py-3 hover:bg-black/5 transition"
          >
            <div className="flex items-center gap-3">
              <Image src="/gb.svg" alt="EN" width={20} height={20} className="rounded-sm"/>
              <span className="text-sm font-semibold uppercase">
                Global
              </span>
            </div>

            {isEn && (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </button>

        </div>
      )}
    </div>
  );
}
