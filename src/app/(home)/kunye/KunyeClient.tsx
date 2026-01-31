"use client";

import Image from "next/image";
import {
  Briefcase,
  Rocket,
  Users,
  Target,
  Globe2,
  Mail,
  Linkedin,
  Twitter,
} from "lucide-react";
import { usePathname } from "next/navigation";
import "@/styles/kunye.css";
import { useAutoPageView } from "@/lib/analytics/useAutoPageView";


export default function KunyeClient() {
  useAutoPageView();
  const pathname = usePathname();
  const isEn = pathname === "/en" || pathname.startsWith("/en/");

  return (
    <section className="kunye-section kunye-root">
      <div className="kunye-container">

        {/* PERSON */}
        <div className="person-top">
          <div className="person-avatar">
            <Image
              src="/hakancoskun.png"
              alt="Hakan Coşkun"
              width={140}
              height={140}
            />
          </div>

          <div className="person-name">Hakan Coşkun</div>
          <div className="person-role">
            {isEn ? "Concessionaire" : "İmtiyaz Sahibi"}
          </div>

          <div className="person-socials">
            <a href="mailto:hakan@kuzeybatihaber.com.tr">
              <Mail size={16} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <Linkedin size={16} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <Twitter size={16} />
            </a>
          </div>
        </div>

        {/* HERO */}
        <div className="hero">
          <h1>
            {isEn
              ? "Where there is a free press, there is a free society."
              : "Özgür basın varsa, Özgür toplum vardır"}
          </h1>
          <p>
            {isEn
              ? `Founded 15 years ago, Kuzeybatı International is a digital media
organization focused on journalism, news technologies, and modern publishing
systems. Our mobile application was officially launched in 2026, expanding
our reach across digital platforms.`
              : `15 yıl önce kurulan Kuzeybatı International; dijital gazetecilik,
haber teknolojileri ve modern yayıncılık altyapıları üzerine odaklanan
bir medya kuruluşudur. Mobil uygulamamız 2026 yılında yayınlanarak
çoklu platform erişimi sağlanmıştır.`}
          </p>
        </div>

        {/* MISSION / VISION */}
        <div className="cards-2">
          <div className="card">
            <div className="card-header">
              <Target />
              <h2>{isEn ? "Our Mission" : "Misyonumuz"}</h2>
            </div>
            <p>
              {isEn
                ? "To deliver accurate, transparent, and trustworthy news using modern technologies."
                : "Modern teknolojilerle doğru, şeffaf ve güvenilir haber sunmak."}
            </p>
          </div>

          <div className="card">
            <div className="card-header">
              <Rocket />
              <h2>{isEn ? "Our Vision" : "Vizyonumuz"}</h2>
            </div>
            <p>
              {isEn
                ? "To become a globally recognized digital media brand."
                : "Küresel ölçekte tanınan bir dijital medya markası olmak."}
            </p>
          </div>
        </div>

        {/* WHAT WE DO */}
        <div className="features">
          <h2>{isEn ? "What We Do" : "Ne Yapıyoruz"}</h2>

          <div className="feature-grid">
            <div className="feature">
              <Briefcase />
              <h3>Dijital Gazetecilik</h3>
              <p>Hızlı, doğru ve etik haber yayıncılığı.</p>
            </div>

            <div className="feature">
              <Users />
              <h3>Mobil & Web Yayın</h3>
              <p>Mobil uygulama ve web tabanlı içerik dağıtımı.</p>
            </div>

            <div className="feature">
              <Globe2 />
              <h3>Küresel Erişim</h3>
              <p>Çok dilli ve bölgesel yayın altyapıları.</p>
            </div>
          </div>
        </div>

        {/* TIMELINE */}
        <div className="timeline">
          <h2>{isEn ? "Our Journey" : "Yolculuğumuz"}</h2>

          <div className="timeline-list">
            {[
              ["2015", isEn ? "Foundation" : "Kuruluş",
                isEn
                  ? "Kuzeybatı International was founded as a local media initiative with a focus on independent journalism and regional news coverage."
                  : "Kuzeybatı International, bağımsız gazetecilik ve yerel haber odaklı bir medya girişimi olarak kuruldu."
              ],
              ["2018", isEn ? "National Reach & Content Expansion" : "Ulusal Erişim",
                isEn
                  ? "Coverage expanded to national-level news."
                  : "Batı Karadeniz bölgesinden haberleri okuyuculara ulaştırmaya başlandı."
              ],
              ["2021", isEn ? "Editorial Infrastructure Renewal" : "Editoryal Altyapı",
                isEn
                  ? "Editorial systems were modernized."
                  : "Editoryal altyapı yenilendi."
              ],
              ["2024", isEn ? "AI-Supported News Systems" : "Yapay Zeka Sistemleri",
                isEn
                  ? "AI-assisted tools were introduced."
                  : "Yapay zeka destekli sistemler devreye alındı."
              ],
              ["2026", isEn ? "Mobile Application Launch" : "Mobil Uygulama",
                isEn
                  ? "Official mobile app launched."
                  : "Resmi mobil uygulama yayınlandı."
              ],
            ].map(([year, title, text]) => (
              <div className="timeline-item" key={year}>
                <span className="timeline-dot" />
                <div className="timeline-year">{year}</div>
                <div className="timeline-title">{title}</div>
                <div className="timeline-text">{text}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
