import type { Metadata } from "next";
import WeatherPage from "./shared/WeatherPage";
export const dynamic = "force-dynamic";


export const metadata: Metadata = {
  title: "İstanbul Hava Durumu | 6 Günlük Tahmin",
  description: "İstanbul için güncel hava durumu ve 6 günlük tahmin.",
  alternates: { canonical: "/hava-durumu" },
};

export default function Page() {
  return <WeatherPage citySlug={null} />;
}
