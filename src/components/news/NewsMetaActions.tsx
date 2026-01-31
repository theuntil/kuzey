"use client";

import { Play } from "lucide-react";

interface Props {
  /** eski alan (opsiyonel). Artık bununla karar vermiyoruz. */
  hasVideo?: boolean;
  /** video varsa URL dolu olmalı; bununla karar veriyoruz */
  videoUrl?: string | null;
  lang: "tr" | "en";
  onOpenSummary: () => void;
}

function hasValidVideoUrl(videoUrl?: string | null) {
  if (!videoUrl) return false;
  const v = String(videoUrl).trim();
  if (!v) return false;

  // Bazı projelerde "null" / "undefined" string olarak gelebiliyor
  if (v.toLowerCase() === "null" || v.toLowerCase() === "undefined") return false;

  return true;
}

export default function NewsMetaActions({
  hasVideo, // geriye dönük uyumluluk için duruyor ama kullanılmıyor
  videoUrl,
  lang,
  onOpenSummary,
}: Props) {
  const showVideoButton = hasValidVideoUrl(videoUrl);

  return (
    <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
      {/* AI HABER ÖZETİ */}
      <button
        onClick={onOpenSummary}
        className="inline-flex items-center justify-center h-9 sm:h-11 px-4 sm:px-5 gap-1.5 sm:gap-2 rounded-full border border-neutral-300 text-xs sm:text-sm font-semibold text-neutral-800 hover:bg-neutral-50 transition"
      >
        <img src="/gpt.webp" alt="AI" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span>{lang === "en" ? "AI News Summary" : "AI Haber Özeti"}</span>
      </button>

      {/* VİDEOLU HABER */}
      {showVideoButton && (
        <button
          type="button"
          onClick={() => {
            document
              .querySelector("[data-news-image]")
              ?.scrollIntoView({ behavior: "smooth", block: "center" });
            setTimeout(() => window.dispatchEvent(new Event("openLastMedia")), 300);
          }}
          className="inline-flex items-center justify-center h-9 sm:h-11 px-4 sm:px-5 gap-1.5 sm:gap-2 rounded-full bg-red-700 text-white text-xs sm:text-sm font-semibold hover:bg-red-800 transition"
        >
          <Play size={13} className="sm:hidden" fill="currentColor" />
          <Play size={15} className="hidden sm:block" fill="currentColor" />
          <span>{lang === "en" ? "Video News" : "Videolu Haber"}</span>
        </button>
      )}
    </div>
  );
}
