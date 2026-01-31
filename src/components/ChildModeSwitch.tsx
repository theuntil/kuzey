"use client";

import { ShieldCheck } from "lucide-react";
import clsx from "clsx";
import { useChildModeStore } from "@/store/childModeStore";
import { useToast } from "@/components/ui/ToastProvider";

export default function ChildModeSwitch({ lang }: { lang: "tr" | "en" }) {
  const isEn = lang === "en";
  const { enabled, toggle } = useChildModeStore();
  const { show } = useToast();

  function onToggle() {
    toggle();
    show(
      enabled
        ? isEn
          ? "Child Mode disabled"
          : "Çocuk modu kapatıldı"
        : isEn
        ? "Child Mode enabled"
        : "Çocuk modu açıldı",
      enabled ? "error" : "success"
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-black/60 text-xs">
        <ShieldCheck className="w-4 h-4" />
        <span>{isEn ? "Child Mode" : "Çocuk Modu"}</span>
      </div>

      <button
        onClick={onToggle}
        className={clsx(
          "relative w-8 h-5 rounded-full transition-colors duration-300",
          enabled ? "bg-[#299c5f]" : "bg-[#b91111]"
        )}
      >
        <span
          className={clsx(
            "absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform duration-300",
            enabled ? "translate-x-3" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}
