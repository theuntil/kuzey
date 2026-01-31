import type { Metadata } from "next";
import PrayerTimesPage from "./shared/PrayerTimesPage";



export const metadata: Metadata = {
  title: "İstanbul Namaz Vakitleri | Güncel Saatler",
  description:
    "İstanbul için güncel namaz vakitleri: İmsak, Öğle, İkindi, Akşam, Yatsı.",
  alternates: { canonical: "/namaz" },
};

export default function Page() {
  return <PrayerTimesPage citySlug={null} />;
}
