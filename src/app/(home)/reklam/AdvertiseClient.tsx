'use client';
import { useAutoPageView } from "@/lib/analytics/useAutoPageView";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, AreaChart, Area
} from 'recharts';
import {
  ArrowRight, TrendingUp, Smartphone, Globe,
  CheckCircle2, Mail, ExternalLink,
  BarChart3, Activity, Sparkles
} from 'lucide-react';

// =========================
// DATA
// =========================

const monthlyViews = [
  { m: 'Oca', v: 780000 },
  { m: 'Şub', v: 820000 },
  { m: 'Mar', v: 910000 },
  { m: 'Nis', v: 980000 },
  { m: 'May', v: 1120000 },
  { m: 'Haz', v: 1240000 },
];

const ctrTrend = [
  { d: '1', c: 2.8 },
  { d: '2', c: 3.1 },
  { d: '3', c: 3.0 },
  { d: '4', c: 3.4 },
  { d: '5', c: 3.6 },
  { d: '6', c: 3.9 },
];

export default function AdvertiseClient() {
   useAutoPageView(); 
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 md:px-8 py-10 md:py-14">
      {/* HERO */}
      <section className={clsx(
        'grid grid-cols-1 lg:grid-cols-2 gap-10 items-center transition-all duration-700',
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      )}>
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-black/5 px-4 py-2 text-sm font-semibold mb-4">
            <Sparkles className="h-4 w-4" /> Binlerce Kişiye Ulaşın
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Kuzeybatı Haber’de Reklam Verin
          </h1>

          <p className="mt-4 max-w-xl text-[16px] text-black/70">
            Markanızı binlerce kullanıcıya ulaştırın. Haber akışı içinde doğal,
            dikkat çekici ve yüksek etkileşimli reklam alanları sunuyoruz.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Chip icon={<Globe className="h-4 w-4" />} label="Web" />
            <Chip icon={<Smartphone className="h-4 w-4" />} label="Android Uygulama" />
            <Chip icon={<Smartphone className="h-4 w-4" />} label="iOS Uygulama" />
          </div>

          <div className="mt-8 flex gap-4">
            <Link href="#paketler" className="inline-flex items-center gap-2 rounded-full bg-black text-white px-6 py-3 text-sm font-extrabold">
              Paketleri İncele <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="#iletisim" className="inline-flex items-center gap-2 rounded-full border border-black/10 px-6 py-3 text-sm font-bold">
              İletişim <Mail className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <Image src="/hero.png" alt="Advertising" width={900} height={600} className="rounded-3xl" />
      </section>

      {/* PRICING */}
      <section id="paketler" className="mt-16">
        <Header icon={<CheckCircle2 />} title="Reklam Paketleri" subtitle="Net fiyat, yüksek görünürlük" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Price title="Aylık" price="250₺" features={['Web', 'URL yönlendirme']} />
          <Price highlight title="Yıllık" price="2500₺" features={['Web', 'URL yönlendirme']} />
        </div>
      </section>
    </main>
  );
}

// =========================
// UI PARTS
// =========================

function Chip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return <span className="inline-flex items-center gap-2 rounded-full bg-black/5 px-4 py-2 text-sm font-semibold">{icon}{label}</span>;
}

function Header({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 text-black/70">{icon}<span className="font-semibold">{subtitle}</span></div>
      <h2 className="mt-2 text-2xl font-extrabold">{title}</h2>
    </div>
  );
}

function Price({ title, price, features, highlight }: { title: string; price: string; features: string[]; highlight?: boolean }) {
  return (
    <div className={clsx('rounded-3xl p-8 border', highlight ? 'bg-black text-white' : 'bg-white border-black/5')}>
      <h4 className="text-xl font-extrabold">{title}</h4>
      <div className="mt-4 text-4xl font-extrabold">{price}</div>
      <ul className="mt-6 space-y-2">
        {features.map(f => (
          <li key={f} className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
