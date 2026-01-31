"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { ShieldCheck, ChevronLeft } from "lucide-react";

import { CATEGORY_MAP } from "@/lib/categories";
import { useToast } from "@/components/ui/ToastProvider";

/* ---------------- HELPERS ---------------- */

function isEnglishPath(pathname: string) {
  return pathname === "/en" || pathname.startsWith("/en/");
}

function isCategoryActive(
  pathname: string,
  isEn: boolean,
  trSlug: string,
  enSlug: string
) {
  const base = isEn ? `/en/${enSlug}` : `/${trSlug}`;
  return pathname === base || pathname.startsWith(`${base}/`);
}

/* ---------------- COMPONENT ---------------- */

export default function Sidebar() {
  const pathname = usePathname() || "/";
  const isEn = isEnglishPath(pathname);
  const toast = useToast();

  const [childMode, setChildMode] = useState(false);
  const [mode, setMode] = useState<"categories" | "cities">("categories");

  const sidebarRef = useRef<HTMLDivElement>(null);

  /* -------- DATA -------- */

  const sidebarCategories = Object.values(CATEGORY_MAP).filter(
    (c) => c.showInSidebar === true
  );

  const cityCategories = Object.values(CATEGORY_MAP).filter((c) =>
    isEn ? Boolean((c as any).global) : c.city === true
  );

  /* -------- OUTSIDE CLICK -------- */

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (
        mode === "cities" &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        setMode("categories");
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () =>
      document.removeEventListener("mousedown", handleOutsideClick);
  }, [mode]);

  /* -------- HANDLERS -------- */

  function toggleChildMode() {
    const next = !childMode;
    setChildMode(next);

    toast.show(
      isEn
        ? next
          ? "Child mode enabled"
          : "Child mode disabled"
        : next
        ? "Çocuk modu açıldı"
        : "Çocuk modu kapatıldı"
    );
  }

  /* -------- STYLES -------- */

  const itemBase =
    "flex items-center gap-3 w-full rounded-xl px-5 py-4.5 text-xs font-semibold tracking-wide transition-colors";
  const itemInactive = "text-white/40 hover:text-white/80";
  const itemActive = "bg-[#23272A] font-bold text-white";

  const homeActive =
    (!isEn && pathname === "/") || (isEn && pathname === "/en");

  /* ---------------- RENDER ---------------- */

  return (
    <aside className="hidden lg:block w-[307px] h-screen sticky top-0">
      <div className="pl-3 pr-9 pt-8 h-full">
        {/* LOGO BURASIII ADNANNNN flex justify-center mb-12*/}
        <div className="flex justify-start ml-5 mb-10">
          <Image
            src="/logo.webp"
            alt="Kuzeybatı Haber"
            width={100}
            height={120}
            priority
          />
        </div>

        {/* ANA SİYAH KART */}
        <div
          ref={sidebarRef}
          className="relative bg-black rounded-[1.4rem] h-[calc(100vh-145px)] overflow-hidden"
        >
          {/* ---------------- CATEGORIES MODE ---------------- */}
          <div
            className={clsx(
              "absolute inset-0 px-7 py-8 transition-all duration-300 ease-out",
              mode === "categories"
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4 pointer-events-none"
            )}
          >
            <nav className="space-y-2">
              <Link
                href={isEn ? "/en" : "/"}
                className={clsx(
                  itemBase,
                  homeActive ? itemActive : itemInactive
                )}
              >
                {(isEn ? "Home" : "Anasayfa").toLocaleUpperCase("tr-TR")}
              </Link>

              {sidebarCategories.map((cat) => {
                const href = isEn ? `/en/${cat.en}` : `/${cat.tr}`;
                const active = isCategoryActive(
                  pathname,
                  isEn,
                  cat.tr,
                  cat.en
                );

                return (
                  <Link
                    key={cat.tr}
                    href={href}
                    className={clsx(
                      itemBase,
                      active ? itemActive : itemInactive
                    )}
                  >
                    {(isEn ? cat.label_en : cat.label_tr).toLocaleUpperCase(
                      "tr-TR"
                    )}
                  </Link>
                );
              })}

              {/* ŞEHİRLER SATIRI */}
              <button
                onClick={() => setMode("cities")}
                className={clsx(
                  itemBase,
                  "text-white/40 hover:text-white underline"
                )}
              >
               
                {(isEn ? "Citys" : "Şehirler").toLocaleUpperCase("tr-TR")}
              </button>
            </nav>

            {/* ALT ALAN */}
            <div className="absolute bottom-6 left-5 right-5 space-y-5 mb-1">
              {/* ÇOCUK MODU */}
              <div className="flex items-center justify-between text-white/50 text-sm px-4 ">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isEn ? "Child Mode" : "Çocuk Modu"}</span>
                </div>

                <button
                  onClick={toggleChildMode}
                  className={clsx(
                    "w-11 h-6 rounded-full relative",
                    childMode ? "bg-[#da3e40]" : "bg-white/20"
                  )}
                >
                  <span
                    className={clsx(
                      "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                      childMode ? "right-1" : "left-1"
                    )}
                  />
                </button>
              </div>

              {/* FOOTER LINKLER */}
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-white/30">
                <Link href="/reklam" className="hover:text-white">
                  {isEn ? "Advertising" : "Reklam"}
                </Link>
                <Link href="/hakkimizda" className="hover:text-white">
                  {isEn ? "About Us" : "Hakkımızda"}
                </Link>
                <Link href="/iletisim" className="hover:text-white">
                  {isEn ? "Contact" : "İletişim"}
                </Link>
                <Link href="/kullanim-kosullari" className="hover:text-white">
                  {isEn ? "Terms of Use" : "Kullanım Koşulları"}
                </Link>
                <Link href="/gizlilik-politikasi" className="hover:text-white">
                  {isEn ? "Privacy Policy" : "Gizlilik Politikası"}
                </Link>
              </div>
            </div>
          </div>

          {/* ---------------- CITIES MODE ---------------- */}
          <div
            className={clsx(
              "absolute inset-0 px-5 py-8 transition-all duration-300 ease-out",
              mode === "cities"
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4 pointer-events-none"
            )}
          >
            <button
              onClick={() => setMode("categories")}
              className="flex items-center gap-2 text-white/50 hover:text-white mb-6 text-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              {isEn ? "Back" : "Geri"}
            </button>

            <div className="space-y-1 max-h-[calc(100%-32px)] overflow-y-auto pr-1">
              {cityCategories.map((cat) => {
                const href = isEn ? `/en/${cat.en}` : `/${cat.tr}`;
                const active = isCategoryActive(
                  pathname,
                  isEn,
                  cat.tr,
                  cat.en
                );

                return (
                  <Link
                    key={cat.tr}
                    href={href}
                    onClick={() => setMode("categories")}
                    className={clsx(
                      itemBase,
                      active ? itemActive : itemInactive
                    )}
                  >
                    {(isEn ? cat.label_en : cat.label_tr).toLocaleUpperCase(
                      "tr-TR"
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
