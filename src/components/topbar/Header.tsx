"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import {
  Search, ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Home,
} from "lucide-react";
import "../../app/globals.css";

import { CATEGORY_MAP } from "@/lib/categories";
import { useToast } from "@/components/ui/ToastProvider";

import QuickAccessMenu from "../QuickAccessMenu";
import LanguageSwitcher from "../LanguageSwitcher";   
// ✅ SADECE BUNU EKLEDİK: gerçek store
import { useChildModeStore } from "@/store/childModeStore";

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

export default function Topbar() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const isEn = isEnglishPath(pathname);
const toast = useToast();

// ❌ ESKİ LOCAL STATE SİLİNDİ
// const [childMode, setChildMode] = useState(false);

// ✅ YENİ: store’dan al
const childMode = useChildModeStore((s) => s.enabled);
const setChildMode = useChildModeStore((s) => s.setEnabled);



  /* header state */
  const [mode, setMode] = useState<"categories" | "cities">("categories");

  const barRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* drag scroll */
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  /* data */
  const sidebarCategories = Object.values(CATEGORY_MAP).filter(
    (c) => c.showInSidebar === true
  );

  const cityCategories = Object.values(CATEGORY_MAP).filter((c) =>
    isEn ? Boolean((c as any).global) : c.city === true
  );
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

/* outside click – sadece cities için */
useEffect(() => {
  function handleClick(e: MouseEvent) {
    if (
      mode === "cities" &&
      barRef.current &&
      !barRef.current.contains(e.target as Node)
    ) {
      setMode("categories");
    }
  }

  document.addEventListener("mousedown", handleClick);
  return () => document.removeEventListener("mousedown", handleClick);
}, [mode]);



  /* drag handlers */
  function onMouseDown(e: React.MouseEvent) {
    if (!scrollRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  }

  function onMouseUp() {
    isDragging.current = false;
  }

  function onMouseLeave() {
    isDragging.current = false;
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  }

  /* styles */
const baseItem =
  "flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-3 text-xs font-semibold tracking-wide border transition-all duration-200 ";

const itemActive =
  "border-transparent bg-black/90 text-white shadow-sm hover:bg-black/80 hover:shadow";

const itemInactive =
  "border-black/5 bg-white text-black/80 hover:border-black/25 hover:bg-zinc-50 hover:text-black ";


  const homeActive =
    (!isEn && pathname === "/") || (isEn && pathname === "/en");

  /* ---------------- RENDER ---------------- */

  return (
    <header className="hidden lg:block pb-12 pt-8 bg-transparent">
      <div className="w-full flex justify-center">
        <div className="w-[90%] flex items-center gap-6">
          {/* LOGO */}
         <Link
  href={isEn ? "/en" : "/"}
  className="shrink-0 flex items-center"
>
  <Image
    src="/sdsd.png"
    alt="Site Logo"
    width={140}
    height={36}
    priority
    className="h-7 w-auto object-contain"
  />
</Link>


          {/* CENTER */}
          <div ref={barRef} className="relative flex-1  ml-12 min-w-0 overflow-hidden">
            {/* CATEGORIES */}
            <div
              className={clsx(
                "flex items-center gap-3 transition-all duration-300",
                mode === "categories"
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              )}
            >
              <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                <Link
                  href={isEn ? "/en" : "/"}
                  className={clsx(
                    baseItem,
                    homeActive ? itemActive : itemInactive
                  )}
                >
                  <Home className="w-4 h-4" />
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
                        baseItem,
                        active ? itemActive : itemInactive
                      )}
                    >
                      {(isEn
                        ? cat.label_en
                        : cat.label_tr
                      ).toUpperCase()}
                    </Link>
                  );
                })}

                <button
                  onClick={() => setMode("cities")}
                  className={clsx(baseItem, itemInactive)}
                >
                  {(isEn ? "Citys" : "Şehirler").toUpperCase()}
                </button>
              </nav>
            </div>

            {/* CITIES */}
            <div
              className={clsx(
                "absolute inset-0 flex items-center transition-all duration-300",
                mode === "cities"
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              )}
            >
              <button
                onClick={() => setMode("categories")}
                className="flex items-center gap-1 text-xs shrink-0 mr-3"
              >
                <ChevronLeft className="w-4 h-4" />
                {isEn ? "Back" : "Geri"}
              </button>

              <div className="relative flex-1 overflow-hidden">
                {/* shadows */}
               
                {/* scroll */}
                <div
                  ref={scrollRef}
                  className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4 pr-24 cursor-grab active:cursor-grabbing"
                  onMouseDown={onMouseDown}
                  onMouseUp={onMouseUp}
                  onMouseLeave={onMouseLeave}
                  onMouseMove={onMouseMove}
                >
                  {cityCategories.map((cat) => {
                    const href = isEn ? `/en/${cat.en}` : `/${cat.tr}`;
                    return (
                      <Link
                        key={cat.tr}
                        href={href}
                        onClick={() => setMode("categories")}
                        className={clsx(baseItem, itemInactive)}
                      >
                        {(isEn
                          ? cat.label_en
                          : cat.label_tr
                        ).toUpperCase()}
                      </Link>
                    );
                  })}
                </div>

              

                {/* arrow */}
                <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white animate-scroll-hint-strong pointer-events-none" />
              </div>
            </div>
          </div>

       


<div className="flex items-center gap-5">
  
  {/* SEARCH */}
  <button
    type="button"
    onClick={() => router.push(isEn ? "/en/arama" : "/arama")}
    className={clsx(
      "grid place-items-center w-9 h-9 rounded-xl border transition-all duration-200",
      "border-black/5 text-black/70 hover:border-black/25 hover:bg-zinc-50 hover:text-black"
    )}
    aria-label={isEn ? "Search" : "Ara"}
    title={isEn ? "Search" : "Ara"}
  >
    <Search className="w-5 h-5" />
  </button>
  {/* APP / GALLERY ICON */}
  <QuickAccessMenu />
<LanguageSwitcher />

  {/* CHILD MODE */}
  <div className="flex items-center gap-3">
    <div className="flex items-center gap-2 text-black/60 text-xs">
      <ShieldCheck className="w-4 h-4" />
      <span>{isEn ? "Child Mode" : "Çocuk Modu"}</span>
    </div>

   <button
  onClick={toggleChildMode}
  className={clsx(
    "relative w-8 h-5 rounded-full transition-colors duration-300 ease-out",
    "active:scale-[0.96]",
    childMode
      ? "bg-[#299c5f] shadow-[0_0_0_0_rgba(41,156,95,0.4)]"
      : "bg-[#b91111] shadow-[0_0_0_0_rgba(185,17,17,0.4)]"
  )}
>
  <span
    className={clsx(
      "absolute top-1 left-1 w-3 h-3 rounded-full bg-white",
      "transition-transform duration-300",
      "ease-[cubic-bezier(0.34,1.56,0.64,1)]",
      childMode ? "translate-x-3" : "translate-x-0"
    )}
  />
</button>

  </div>
</div>



        </div>
      </div>

      
    </header>
  );
}
