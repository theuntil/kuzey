"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Menu, Search, ChevronDown, ChevronUp } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import MobileMenu from "./MobileMenu";
import Link from "next/link";
import QuickAccessMenu from "../QuickAccessMenu";
import LanguageSwitcher from "../LanguageSwitcher";


function isEnglishPath(pathname: string) {
  return pathname === "/en" || pathname.startsWith("/en/");
}

export default function MobileHeader() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const isEn = isEnglishPath(pathname);

  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* Close lang dropdown on outside click */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* Close mobile menu on large screens */
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setMenuOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  /* Search button */
  function handleSearch() {
    router.push(isEn ? "/arama" : "/arama");
  }

  return (
    <>
      {/* ---------------- HEADER ---------------- */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#F4F5F6] backdrop-blur-md">
        <div className="h-15 px-4 flex items-center justify-between">
          {/* MENU BUTTON */}
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 rounded-xl hover:bg-black/5 transition"
          >
            <Menu className="w-5 h-5 text-black" />
          </button>

         {/* LOGO */}
<Link href={isEn ? "/en" : "/"} className="shrink-0">
  <Image
    src="/sdsd.png"
    alt="Kuzeybatı Haber"
    width={170}
    height={40}
    priority
  />
</Link>


          {/* SEARCH + LANG */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSearch}
              className="p-2 rounded-xl hover:bg-black/5 transition"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-black" />
            </button>

           

             <QuickAccessMenu />
             <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* ---------------- MOBILE MENU ---------------- */}
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
