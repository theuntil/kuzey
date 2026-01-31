"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useAutoPageView } from "@/lib/analytics/useAutoPageView";

import {
  Handshake,
  TrendingUp,
  Wallet,
  BarChart3,
  Users,
  BadgePercent,
  Phone,
  Mail,
  CalendarDays,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

/* ======================================================
   FAKE / DEMO DATA (ANLATIM AMAÇLI)
   ====================================================== */

const monthlyAds = Array.from({ length: 12 }).map((_, i) => ({
  month: `${i + 1}. Ay`,
  ads: Math.floor(20 + Math.random() * 80),
}));

const earningsByPerformance = Array.from({ length: 12 }).map((_, i) => ({
  month: `${i + 1}. Ay`,
  kazanc: Math.floor(2000 + Math.random() * 15000),
}));

/* ======================================================
   PAGE
   ====================================================== */

export default function IsBirligiClient() {
  useAutoPageView();
  return (
    <main className="w-full overflow-x-hidden">

      {/* ==================================================
          HERO
         ================================================== */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 animate-[fadeIn_0.8s_ease-out]">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              10. Yıla Özel İş Birliği Programı
            </div>

            <h1 className="text-4xl md:text-5xl font-black leading-tight text-gray-900">
              Kuzeybatı Haber ile
              <br />
              <span className="text-indigo-600">Kazan–Kazan</span> İş Birliği
            </h1>

            <p className="text-lg text-gray-600 max-w-xl">
              10. yılımıza özel başlattığımız bu programda, reklam getiren
              iş ortaklarımız <b>performansına göre</b> gelir elde eder.
              Ne kadar reklam, o kadar kazanç.
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <BadgePercent className="w-5 h-5 text-indigo-600" />
                Reklam Ücreti: 250 TL / Ay
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Wallet className="w-5 h-5 text-indigo-600" />
                %50 Kazanç Payı
              </div>
            </div>
          </div>

          <div className="relative animate-[slideUp_0.9s_ease-out]">
            <Image
              src="/hero.png"
              alt="İş Birliği"
              width={520}
              height={420}
              className="rounded-3xl shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* ==================================================
          NASIL KAZANIRSIN?
         ================================================== */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-extrabold mb-12 flex items-center gap-3">
          <Handshake className="w-7 h-7 text-indigo-600" />
          Kazanç Modeli Nasıl Çalışır?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StepCard
            icon={<CalendarDays />}
            title="1 Aylık Kampanya"
            text="10. yıla özel her reklam kampanyası aylık sadece 250 TL."
          />
          <StepCard
            icon={<BadgePercent />}
            title="%50 Paylaşım"
            text="Her alınan kampanyanın %50’si (125 TL) doğrudan sana yazılır."
          />
          <StepCard
            icon={<TrendingUp />}
            title="Performansa Göre"
            text="Ne kadar çok reklam getirirsen, kazancın o kadar artar."
          />
        </div>
      </section>

      {/* ==================================================
          GRAFİKLER
         ================================================== */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
              Aylık Alınan Reklam Sayısı
            </h3>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={monthlyAds}>
                <defs>
                  <linearGradient id="ads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="ads"
                  stroke="#6366f1"
                  fill="url(#ads)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Wallet className="w-6 h-6 text-indigo-600" />
              Performansa Göre Kazanç (TL)
            </h3>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={earningsByPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="kazanc"
                  stroke="#22c55e"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* ==================================================
          ÖRNEK SENARYO
         ================================================== */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="bg-white rounded-3xl shadow-lg p-10">
          <h3 className="text-2xl font-extrabold mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            Örnek Kazanç Senaryosu
          </h3>

          <ul className="space-y-4 text-gray-700">
            <li>• 1 adet reklam kampanyası → <b>125 TL</b> kazanç</li>
            <li>• 10 adet kampanya → <b>1.250 TL</b> kazanç</li>
            <li>• 50 adet kampanya → <b>6.250 TL</b> kazanç</li>
            <li>• 100 adet kampanya → <b>12.500 TL</b> kazanç</li>
          </ul>

          <p className="mt-6 text-sm text-gray-500">
            Kazanç tamamen <b>kendi performansına bağlıdır</b>. Sabit maaş yok,
            sınır yok.
          </p>
        </div>
      </section>

      {/* ==================================================
          İLETİŞİM
         ================================================== */}
      <section className="bg-indigo-600 py-20 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h3 className="text-3xl font-black">Detaylı Bilgi ve Başvuru</h3>
          <p className="text-lg text-indigo-100">
            İş birliği programımıza katılmak için bizimle iletişime geçin.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center text-lg font-semibold">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5" />
              0533 443 49 78
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5" />
              reklam@kuzeybatihaber.com.tr
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ======================================================
   SMALL COMPONENTS
   ====================================================== */

function StepCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition">
      <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h4 className="font-bold text-lg mb-2">{title}</h4>
      <p className="text-gray-600">{text}</p>
    </div>
  );
}
