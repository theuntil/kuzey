import MobileHeader from "@/components/mobile/MobileHeader";
import HistoryTracker from "@/components/HistoryTracker";
import { SummaryProvider } from "@/components/news/SummaryContext";
import NewsSummarySheet from "@/components/news/NewsSummarySheet";
import Header from "@/components/topbar/Header";
import Footer from "@/components/Footer";


export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HistoryTracker />

      <SummaryProvider>
        <MobileHeader />
        <Header />

        <main className="min-h-screen bg-[#F4F5F6]">
          <div className="mx-auto px-5">
            <section className="min-w-0">
              {children}
            </section>
          </div>
        </main>
          {/* FOOTER */}
        <Footer lang="tr" />

        <NewsSummarySheet />
      </SummaryProvider>
    </>
  );
}
