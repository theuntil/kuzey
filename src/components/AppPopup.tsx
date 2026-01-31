"use client";

import { useEffect, useState } from "react";

const KEY = "app_popup_hide_until";
const HIDE_TIME = 10 * 60 * 1000;

const IOS_LINK = "#";
const ANDROID_LINK = "#";

type Platform = "ios" | "android" | "desktop";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/android/.test(ua)) return "android";
  return "desktop";
}

export default function AppPopup() {
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const [platform, setPlatform] = useState<Platform>("desktop");

  useEffect(() => {
    setPlatform(detectPlatform());

    const until = localStorage.getItem(KEY);
    if (until && Date.now() < Number(until)) return;

    const t = setTimeout(() => setMounted(true), 4000);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    localStorage.setItem(KEY, String(Date.now() + HIDE_TIME));
    setClosing(true);
    setTimeout(() => setMounted(false), 320);
  };

  if (!mounted) return null;

  const appLink =
    platform === "ios"
      ? IOS_LINK
      : platform === "android"
      ? ANDROID_LINK
      : "#";

  const glassCard: React.CSSProperties = {
    background: "rgba(5,5,5,.88)",
    backdropFilter: "blur(18px) saturate(150%)",
    WebkitBackdropFilter: "blur(18px) saturate(150%)",
    color: "#fff",
  };

  const motionStyle: React.CSSProperties = {
    transform: closing
      ? "translate(-50%, 40px)"
      : "translate(-50%, 0)",
    opacity: closing ? 0 : 1,
    transition: "all .38s cubic-bezier(.22,1,.36,1)",
  };

  return (
    <>
      {/* ================= MOBILE (AYNI) ================= */}
      <div
        className="md:hidden"
        style={{
          position: "fixed",
          left: 12,
          right: 12,
          bottom: 12,
          zIndex: 9999,
        }}
      >
        <div
          style={{
            ...glassCard,
            borderRadius: 32,
            padding: 24,
            position: "relative",
          }}
        >
          <button
            onClick={close}
            style={{
              position: "absolute",
              right: 16,
              top: 16,
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "rgba(255,255,255,.12)",
              border: "none",
              color: "#fff",
              fontSize: 18,
              cursor: "pointer",
            }}
          >
            ×
          </button>

          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <img src="/googleplay.webp" style={{ width: 54 }} alt="" />
            <h3 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.25 }}>
              Haberlere anında tarafsız ve hızlı ulaşın. Mobil uygulamamızı keşfedin!
            </h3>
          </div>

          <a
            href={appLink}
            target="_blank"
            style={{
              marginTop: 22,
              display: "block",
              background: "#d6453d",
              padding: "18px",
              borderRadius: 20,
              textAlign: "center",
              color: "#fff",
              fontSize: 17,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Uygulamayı hemen indir
          </a>
        </div>
      </div>

      {/* ================= DESKTOP (MİNİMAL + ORTALI) ================= */}
      <div
        className="hidden md:block"
        style={{
          position: "fixed",
          left: "50%",
          bottom: 24,
          zIndex: 9999,
          ...motionStyle,
        }}
      >
        <div
          style={{
            ...glassCard,
            display: "flex",
            alignItems: "center",
            gap: 20,
            borderRadius: 22,
            padding: "18px 20px",
            maxWidth: 820,
            boxShadow: "0 20px 50px rgba(0,0,0,.45)",
            position: "relative",
          }}
        >
          {/* TEXT */}
          <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.35 }}>
            Haberlere anında tarafsız ve hızlı ulaşın.  
            <span style={{ opacity: 0.8 }}>
              {" "}Mobil uygulamamızı keşfedin!
            </span>
          </div>

          {/* QR */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 14px",
              borderRadius: 16,
              background: "rgba(255,255,255,.08)",
              whiteSpace: "nowrap",
            }}
          >
            <img
              src="https://supabase.kuzeybatihaber.cloud/storage/v1/object/public/news/images/app_qr_code.png"
              style={{ width: 52, height: 52 }}
              alt=""
            />
            
          </div>

          {/* CLOSE */}
          <button
            onClick={close}
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "rgba(255,255,255,.12)",
              border: "none",
              color: "#fff",
              fontSize: 18,
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>
      </div>
    </>
  );
}
