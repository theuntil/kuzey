import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { ToastProvider } from "@/components/ui/ToastProvider";
import AppPopup from "@/components/AppPopup";


const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Kuzeybatı Haber",
    template: "%s | Kuzeybatı Haber",
  },
  description: "KuzeyBatı Haber – Haber, Spor, Ekonomi, Magazin, Son Dakika Haberleri",
  alternates: {
    canonical: "/",
    languages: {
      "tr-TR": "/",
      "en-US": "/en",
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Kuzeybatı Haber",
    title: "Kuzeybatı Haber",
    description: "Güncel haberler, son dakika gelişmeleri ve yerel gündem.",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-[#F4F5F6]">
        <ToastProvider>
          {children}
          <AppPopup />
        </ToastProvider>
      </body>
    </html>
  );
}
