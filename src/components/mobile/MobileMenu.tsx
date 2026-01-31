"use client";

import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { X, ChevronLeft, ShieldCheck } from "lucide-react";
import ChildModeSwitch from "@/components/ChildModeSwitch";

import { CATEGORY_MAP } from "@/lib/categories";


/* ---------- HELPERS ---------- */
function isEnglishPath(pathname: string) {
  return pathname === "/en" || pathname.startsWith("/en/");
}
function langHref(trHref: string, enHref: string, isEn: boolean) {
  return isEn ? enHref : trHref;
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

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const pathname = usePathname() || "/";
  const isEn = isEnglishPath(pathname);


  const [mode, setMode] = useState<"categories" | "cities">("categories");



  /* 🔒 Menü kapanınca her zaman categories */
  useEffect(() => {
    if (!open) {
      setMode("categories");
    }
  }, [open]);

  /* 🔒 Desktop’a geçince menüyü kapat */
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        onClose();
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [onClose]);

  const sidebarCategories = Object.values(CATEGORY_MAP).filter(
    (c) => c.showInSidebar === true
  );

  const cityCategories = Object.values(CATEGORY_MAP).filter((c) =>
    isEn ? Boolean((c as any).global) : c.city === true
  );

 
  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={onClose}
        className={clsx(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      {/* PANEL */}
      <aside
        className={clsx(
          "fixed top-0 left-0 z-50 h-full w-[82%] max-w-[360px] bg-black transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* HEADER */}
        <div className="h-14 px-5 flex items-center justify-between mt-5">
          <Image
            src="/logom.png"
            alt="Kuzeybatı Haber"
            width={170}
            height={90}
            priority
          />
          <button onClick={onClose}>
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="px-5 py-6 flex flex-col justify-between h-[calc(100%-56px)]">
          {/* ---------- NAV ---------- */}
          <div>
            {mode === "categories" && (
              <nav className="space-y-3">
                {/* ANASAYFA */}
                <Link
                  href={isEn ? "/en" : "/"}
                  onClick={onClose}
                  className={clsx(
                    "block rounded-2xl px-6 py-5 text-xs font-semibold tracking-wide transition",
                    (!isEn && pathname === "/") ||
                      (isEn && pathname === "/en")
                      ? "bg-[#2A2D30] text-white"
                      : "text-white/35 hover:text-white"
                  )}
                >
                  {(isEn ? "Home" : "Anasayfa").toUpperCase()}
                </Link>

                {/* KATEGORİLER */}
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
                      onClick={onClose}
                      className={clsx(
                        "block rounded-2xl px-6 py-3.5 text-xs font-semibold tracking-wide transition",
                        active
                          ? "bg-[#2A2D30] text-white"
                          : "text-white/35 hover:text-white"
                      )}
                    >
                      {(isEn ? cat.label_en : cat.label_tr).toUpperCase()}
                    </Link>
                  );
                })}

                {/* ŞEHİRLER → AYNI UI */}
                <button
                  onClick={() => setMode("cities")}
                  className="block w-full text-left rounded-2xl px-6 py-5 text-sm font-semibold tracking-wide text-white/35 hover:text-white transition"
                >
                  {(isEn ? "Cities" : "Şehirler").toUpperCase()}
                </button>
              </nav>
            )}

            {mode === "cities" && (
              <>
                <button
                  onClick={() => setMode("categories")}
                  className="flex items-center gap-2 text-white/50 text-sm mb-5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {isEn ? "BACK" : "GERİ"}
                </button>

                <nav className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {cityCategories.map((cat) => {
                    const href = isEn ? `/en/${cat.en}` : `/${cat.tr}`;

                    return (
                      <Link
                        key={cat.tr}
                        href={href}
                        onClick={onClose}
                        className="block rounded-2xl px-6 py-5 text-sm font-semibold tracking-wide text-white/35 hover:text-white transition"
                      >
                        {(isEn ? cat.label_en : cat.label_tr).toUpperCase()}
                      </Link>
                    );
                  })}
                </nav>
              </>
            )}
          </div>

          {/* ---------- FOOTER ---------- */}
          <div className="space-y-6">
           

           <div
  onClick={() => onClose()} // ✅ switch’e tıklayınca menü kapansın
  className="rounded-2xl bg-white/95 backdrop-blur px-20 py-3 shadow-sm"
>
  <div className="text-black">
    <ChildModeSwitch lang={isEn ? "en" : "tr"} />
  </div>
</div>


           <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-white/30">
  

  <Link
    href={langHref("/reklam", "/reklam", isEn)}
    onClick={onClose}
    className="hover:text-white transition"
  >
    {isEn ? "Ads" : "Reklam"}
  </Link>
<Link
    href={langHref("/kunye", "/kunye", isEn)}
    onClick={onClose}
    className="hover:text-white transition"
  >
    {isEn ? "About Us" : "Hakkımızda"}
  </Link>
  <Link
    href={langHref("/is-birligi", "/is-birligi", isEn)}
    onClick={onClose}
    className="hover:text-white transition"
  >
    {isEn ? "Work Together" : "Birlikte Çalışalım"}
  </Link>

  <Link
    href={langHref("/iletisim", "/iletisim", isEn)}
    onClick={onClose}
    className="hover:text-white transition"
  >
    {isEn ? "Contact" : "İletişim"}
  </Link>
<Link
    href={langHref("/politikalar", "/politikalar", isEn)}
    onClick={onClose}
    className="hover:text-white transition"
  >
    {isEn ? "Policies" : "Politikalar"}
  </Link>
  

 
</div>



            <div className="text-center text-xs text-white/20">
              © {new Date().getFullYear()} Kuzeybatı Haber
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
