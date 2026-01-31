"use client";
import { useAutoPageView } from "@/lib/analytics/useAutoPageView";

import Left from "@/components/LeftHome";
import HomeSectionGrid from "./HomeSectionGrid";
import HomeSectionHorizontal from "./HomeSectionHorizontal";
import VideoGallery from "./VideoGallery";
import HeroManşet from "@/components/home/HeroManset";
import AdsMarquee from "../ads/AdsMarquee";
import App from "@/components/appco";

/* ---------------- TYPES ---------------- */

export type FeedItem = {
  id: string;
  slug: string;
  title: string;
  title_ai: string | null;
  title_en: string | null;
  image_url: string | null;
  video_url: string | null;
  category: string;
  city: string | null;
  published_at: string | null;
  is_child_safe: boolean;
};

type HomeFeed = {
  politika: FeedItem[];
  videos: FeedItem[];
  spor: FeedItem[];
  asayis: FeedItem[];
  ekonomi: FeedItem[];
  saglik: FeedItem[];
  istanbul: FeedItem[];
  ankara: FeedItem[];
  izmir: FeedItem[];
};

/* ---------------- TITLES ---------------- */

const SECTION_TITLES = {
  politika: { tr: "Politika", en: "Politics" },
  spor: { tr: "Spor", en: "Sports" },
  asayis: { tr: "Asayiş", en: "Crime" },
  ekonomi: { tr: "Ekonomi", en: "Economy" },
  saglik: { tr: "Sağlık", en: "Health" },

  istanbul: { tr: "İstanbul", en: "Istanbul" },
  ankara: { tr: "Ankara", en: "Ankara" },
  izmir: { tr: "İzmir", en: "Izmir" },

  videos: { tr: "Video Haberler", en: "Video News" },
};

/* ---------------- COMPONENT ---------------- */

export default function HomePageClient({
  data,
  lang,
}: {
  data: HomeFeed;
  lang: "tr" | "en";
}) {
  useAutoPageView();

  return (
    <main className="mx-auto w-full max-w-7xl lg:max-w-[99vw] md:px-10 py-3">
      <div className="grid grid-cols-1 lg:grid-cols-[210px_1fr] gap-6">

        {/* SOL */}
        <aside className="w-full lg:w-[210px] shrink-0">
          <Left city={lang === "en" ? "Istanbul" : "İstanbul"} />
        </aside>

        {/* SAĞ */}
        <section className="flex flex-col gap-10 min-w-0 w-full">

          <AdsMarquee />
          <HeroManşet lang={lang} />

          <HomeSectionGrid
            title={SECTION_TITLES.politika[lang]}
            items={data.politika}
            lang={lang}
          />

          <VideoGallery items={data.videos} lang={lang} />

          <HomeSectionGrid
            title={SECTION_TITLES.spor[lang]}
            items={data.spor}
            lang={lang}
          />

          <HomeSectionGrid
            title={SECTION_TITLES.asayis[lang]}
            items={data.asayis}
            lang={lang}
          />

          <HomeSectionGrid
            title={SECTION_TITLES.ekonomi[lang]}
            items={data.ekonomi}
            lang={lang}
          />

          <HomeSectionGrid
            title={SECTION_TITLES.saglik[lang]}
            items={data.saglik}
            lang={lang}
          />

          {/* =========================
              MOBİLDE FULL-WIDTH
              DESKTOPTA NORMAL
             ========================= */}

          <div className="-mx-5 ml-1 sm:-mx-6 md:-mx-10 lg:ml-0 lg:mx-0 ">
            <HomeSectionHorizontal
              title={SECTION_TITLES.istanbul[lang]}
              items={data.istanbul}
              lang={lang}
            />
          </div>

          <div className="-mx-5 ml-1  sm:-mx-6 md:-mx-10  lg:ml-0 lg:mx-0">
            <HomeSectionHorizontal
              title={SECTION_TITLES.ankara[lang]}
              items={data.ankara}
              lang={lang}
            />
          </div>

          <div className="-mx-5  ml-1 sm:-mx-6 md:-mx-10 lg:ml-0 lg:mx-0">
            <HomeSectionHorizontal
              title={SECTION_TITLES.izmir[lang]}
              items={data.izmir}
              lang={lang}
            />
          </div>
<App/>
        </section>
      </div>
    </main>
  );
}
