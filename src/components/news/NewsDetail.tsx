"use client";
import { useAutoPageView } from "@/lib/analytics/useAutoPageView";
import Lang from "@/components/LanguageSwitcher";

import { useRouter } from "next/navigation";
import { ArrowLeft, Share2 } from "lucide-react";
import RelatedNews from "./RelatedNews";
import { NewsRow } from "@/types/news";
import App from "@/components/newssapp";
import { useEffect, useState } from "react";
import ShareSheet from "./ShareSheet";
import NewsImage from "@/components/news/NewsImage";
import LikeButton from "@/components/news/LikeButton";
import { useSummary } from "@/components/news/SummaryContext";
import Comments from "@/components/comments/Comments";
import LeftArea from "@/components/LeftHome";

import NewsMetaActions from "@/components/news/NewsMetaActions";
import NewsKeywords from "@/components/news/NewsKeywords";

import { useChildModeStore } from "@/store/childModeStore";
import ChildModeSwitch from "@/components/ChildModeSwitch"; // 🔁 SENİN SWITCH

/* ----------------------------------
   IMAGE HELPERS
---------------------------------- */

const STORAGE =
  "https://supabase.kuzeybatihaber.cloud/storage/v1/object/public/news/";
const PLACEHOLDER =
  "https://supabase.kuzeybatihaber.cloud/storage/v1/object/public/news/images/1.jpg";

function resolveImage(src: string | null) {
  if (!src) return PLACEHOLDER;
  if (src.startsWith("http")) return src;
  return STORAGE + src.replace(/^\/+/, "");
}

function timeAgo(date: string, lang: "tr" | "en") {
  const diff = Date.now() - new Date(date).getTime();
  const min = Math.floor(diff / 60000);
  const h = Math.floor(min / 60);
  const d = Math.floor(h / 24);

  if (min < 1) return lang === "en" ? "just now" : "az önce";
  if (min < 60) return lang === "en" ? `${min} min ago` : `${min} dk önce`;
  if (h < 24) return lang === "en" ? `${h} hours ago` : `${h} saat önce`;
  return lang === "en" ? `${d} days ago` : `${d} gün önce`;
}

function normalizeContent(raw: string): string[] {
  if (!raw) return [];

  let text = raw;

  // 1️⃣ HTML escape edilmiş mi? (&lt;br&gt; gibi)
  const hasEscapedHTML =
    /&lt;br\s*\/?&gt;/i.test(text) || /&lt;\/?p&gt;/i.test(text);

  if (hasEscapedHTML) {
    text = text
      .replace(/&lt;br\s*\/?&gt;/gi, "\n")
      .replace(/&lt;\/p&gt;/gi, "\n")
      .replace(/&lt;p&gt;/gi, "");
  }

  // 2️⃣ Gerçek HTML var mı?
  const hasRealHTML =
    /<br\s*\/?>/i.test(text) || /<\/?p>/i.test(text);

  if (hasRealHTML) {
    text = text
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<p[^>]*>/gi, "");
  }

  // 3️⃣ Ortak temizlik
  text = text
    .replace(/&nbsp;/gi, " ")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();

  // 4️⃣ Eğer hâlâ tek paragraf ise → akıllı böl
  if (!text.includes("\n") && text.length > 300) {
    return text
      .split(/(?<=[.!?])\s+/)
      .map(p => p.trim())
      .filter(Boolean);
  }

  return text
    .split("\n")
    .map(p => p.trim())
    .filter(Boolean);
}


function smartBack(
  router: ReturnType<typeof useRouter>,
  lang: "tr" | "en"
) {
  if (typeof window === "undefined") {
    router.push(lang === "en" ? "/en" : "/");
    return;
  }

  const referrer = document.referrer;

  if (!referrer) {
    router.push(lang === "en" ? "/en" : "/");
    return;
  }

  try {
    const refUrl = new URL(referrer);
    if (refUrl.origin === window.location.origin) {
      router.back();
      return;
    }
  } catch {}

  router.push(lang === "en" ? "/en" : "/");
}

/* ----------------------------------
   SKELETON
---------------------------------- */
function Skeleton({ className }: { className: string }) {
  return <div className={`bg-neutral-200 animate-pulse rounded ${className}`} />;
}

/* ----------------------------------
   COMPONENT
---------------------------------- */
export default function NewsDetail({
  data,
  lang,
}: {
  data: NewsRow;
  lang: "tr" | "en";
}) {
  const router = useRouter();
  const { openSummary } = useSummary();
useAutoPageView(data?.id);


  const [shareOpen, setShareOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* 🔐 CHILD MODE CHECK (EN BAŞTA) */
  const childModeEnabled = useChildModeStore((s) => s.enabled);
  const isBlocked =
    childModeEnabled && data.is_child_safe === false;

  /* 🚫 BLOCKED VIEW */
  if (isBlocked) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-xl space-y-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-green-700">
            {lang === "en"
              ? "Child Mode Enabled"
              : "Çocuk Modundasınız"}
          </h1>

          <p className="text-base md:text-lg text-neutral-700">
            {lang === "en"
              ? "This content contains sensitive material and cannot be accessed while Child Mode is enabled."
              : "Bu içerik hassas içerik barındırdığı için çocuk modunda görüntülenemez. Erişmek için çocuk modunu kapatmanız gerekmektedir."}
          </p>

          <div className="flex justify-center pt-4">
            <ChildModeSwitch lang={lang} />
          </div>
        </div>
      </main>
    );
  }

  /* ----------------------------------
     NORMAL RENDER (ORİJİNAL)
  ---------------------------------- */

  const title =
    lang === "en"
      ? data.title_en ?? data.title
      : data.title_ai ?? data.title;

  const content =
    lang === "en"
      ? data.content_en ?? data.content
      : data.content_ai ?? data.content;

  const imageSrc = resolveImage(data.image_url);

  return (
    <main className="mx-auto w-full max-w-7xl lg:max-w-[92vw] py-5 md:py-0 px-4 md:px-0 grid grid-cols-1 lg:grid-cols-[210px_1fr_300px] gap-8 items-start">
      <aside>
    <LeftArea city={data.city ?? "İSTANBUL"} />

      </aside>
      {/* ORTA SÜTUN */}
      <div className="flex flex-col gap-6">

      <article className="bg-white mb-5 p-7 md:p-13 rounded-3xl -mx-5 md:mx-0">
        <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500 mb-6">
          <button
            onClick={() => smartBack(router, lang)}
            className="flex items-center gap-1 text-black hover:opacity-70"
          >
            <ArrowLeft size={14} />
            <span className="text-xs font-bold">
              {lang === "en" ? "Back" : "Geri"}
            </span>
          </button>

          {data.published_at ? (
            <span className="text-xs">
              {timeAgo(data.published_at, lang)}
            </span>
          ) : (
            <Skeleton className="h-3 w-20" />
          )}

          <span>|</span>

          {data.category ? (
            <span className="text-red-600 text-[10px] font-semibold">
              {data.category}
            </span>
          ) : (
            <Skeleton className="h-3 w-16" />
          )}

          <div className="ml-auto flex items-center gap-4">
            <Lang />
            <button
              onClick={() => setShareOpen(true)}
              className="flex items-center gap-1 hover:opacity-70"
            >


              <Share2 size={14} />
              <span className="hidden md:inline text-xs">
                {lang === "en" ? "Share" : "Paylaş"}
              </span>
            </button>
            <LikeButton newsId={data.id} />
          </div>
        </div>

        {title ? (
          <h1
            className={`text-3xl md:text-4xl font-extrabold leading-tight mb-6 transition-all duration-300 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            {title}
          </h1>
        ) : (
          <Skeleton className="h-8 w-3/4 mb-6" />
        )}

        <NewsMetaActions
          hasVideo={!!data.has_video}
          lang={lang}
          videoUrl={data.video_url}
          onOpenSummary={() =>
            openSummary({
              ai_status: data.ai_status,
              title_ai: data.title_ai,
              summary: data.summary,
            })
          }
        />

        <div className="mb-4">
          <NewsImage
            cover={data.image_url}
            images={(data as any).news_images ?? null}
            videoUrl={(data as any).video_url ?? null}
            alt={title}
          />
        </div>

        {/* 🔗 DISTRIBUTION LINKS */}
<div className="mb-4 flex items-center gap-3 justify-start">
  {/* Google News */}
  <a
    href="https://news.google.com/publications/CAAqMggKIixDQklTR3dnTWFoY0tGV3QxZW1WNVltRjBhV2hoWW1WeUxtTnZiUzUwY2lnQVAB?hl=tr&gl=TR&ceid=TR%3Atr" // 🔴 SENİN LİNK
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition"
  >
    <img
      src="/google.png"
      alt="Google News"
      className="w-4 h-4 "
    />
    <span className="text-xs font-medium text-neutral-700">
      Google News
    </span>
  </a>

  {/* Flipboard */}
  <a
    href="https://flipboard.com/@kuzeybati" // 🔴 SENİN LİNK
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition"
  >
    <img
      src="/flip.svg"
      alt="Flipboard"
      className="w-4 h-4 "
    />
    <span className="text-xs font-medium text-neutral-700 hidden sm:inline">
      Flipboard
    </span>
  </a>
</div>


      <div className="max-w-none text-[16px] md:text-[17px] leading-relaxed space-y-6">
  {normalizeContent(content).map((p, i) => (
    <p key={i} className="text-neutral-800">
      {p}
    </p>
  ))}
</div>


        <NewsKeywords
          keywords={(data as any).keywords ?? null}
          lang={lang}
        />
        

      </article>

<App/>

      </div>

      <aside>
        <RelatedNews
          dbCategory={data.category}
          lang={lang}
          currentSlug={(data as any).slug}
        />

        <div className="mb-10">
          <Comments newsId={data.id} lang={lang} />
        </div>
      </aside>

      <ShareSheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title={title}
        source={data.source_name}
        image={imageSrc}
        url=""
      />
    </main>
  );
}
