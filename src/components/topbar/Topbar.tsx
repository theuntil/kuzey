"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Search,
  ShieldCheck,
  LayoutGrid,
} from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

export default function Topbar() {
  const pathname = usePathname();
  const isEn = pathname === "/en" || pathname.startsWith("/en/");

  const [childMode, setChildMode] = useState(false);

  function toggleChildMode() {
    setChildMode((v) => !v);
  }

  return (
    <header className="hidden lg:block w-full py-3 bg-transparent">
      <div className="mx-auto max-w-[1400px] ">
        <div className="flex h-14 items-center justify-between">
          {/* SOL – SEARCH */}
          <div className="flex items-center gap-3 text-black min-w-[260px]">
            <Search className="w-6 h-6" strokeWidth={2} />
            <span className="text-sm font-semibold text-black/40">
              {isEn ? "Search news & topics" : "Haber ve konu ara"}
            </span>
          </div>

          {/* SAĞ – APP ICON + CHILD MODE */}
          <div className="flex items-center gap-8">
            {/* APP / GALLERY ICON */}
            <button
              className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-black/5 transition"
              aria-label="Apps"
            >
              <LayoutGrid className="w-5 h-5 text-black/70" />
            </button>

            {/* CHILD MODE */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-black/60 text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>{isEn ? "Child Mode" : "Çocuk Modu"}</span>
              </div>

              <button
                onClick={toggleChildMode}
                className={clsx(
                  "w-11 h-6 rounded-full relative transition-colors",
                  childMode ? "bg-[#299c5f]" : "bg-[#b91111]"
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
          </div>
        </div>
      </div>
    </header>
  );
}
