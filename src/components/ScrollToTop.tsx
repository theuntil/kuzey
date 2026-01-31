"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    const t = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0 });
    }, 60); // <-- min delay

    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}
