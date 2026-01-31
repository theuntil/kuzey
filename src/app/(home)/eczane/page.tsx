import type { Metadata } from "next";
import PharmacyPage from "./shared/PharmacyPage";

export const dynamic = "force-dynamic";


export const metadata: Metadata = {
  title: "İstanbul Nöbetçi Eczaneler | Güncel Liste",
  description:
    "İstanbul için güncel nöbetçi eczaneler: adres, telefon ve yol tarifi.",
  alternates: { canonical: "/eczane" },
};

export default function Page() {
  return <PharmacyPage citySlug={null} />;
}
