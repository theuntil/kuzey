"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Sparkles, AlertTriangle } from "lucide-react";
import { useSummary } from "./SummaryContext";

export default function NewsSummarySheet() {
  const { isOpen, payload, closeSummary } = useSummary();

  const sheetRef = useRef<HTMLDivElement | null>(null);
  const startY = useRef<number | null>(null);

  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setClosing(false);
    }
  }, [isOpen]);

  if (!isOpen || !payload) return null;

  const canShow =
    payload.ai_status === "completed" &&
    payload.title_ai &&
    payload.summary;

  /* ---------- CLOSE ---------- */
  function handleClose() {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      closeSummary();
    }, 300);
  }

  /* ---------- SWIPE DOWN ---------- */
  function onTouchStart(e: React.TouchEvent) {
    startY.current = e.touches[0].clientY;
  }

  function onTouchMove(e: React.TouchEvent) {
    if (!startY.current || !sheetRef.current) return;
    const delta = e.touches[0].clientY - startY.current;
    if (delta > 0) {
      sheetRef.current.style.transform = `translateY(${delta}px)`;
    }
  }

  function onTouchEnd() {
    if (!sheetRef.current) return;
    const value = parseInt(
      sheetRef.current.style.transform.replace(/[^\d]/g, ""),
      10
    );
    if (value > 140) handleClose();
    else sheetRef.current.style.transform = "translateY(0)";
    startY.current = null;
  }

  const isDesktop =
    typeof window !== "undefined" && window.innerWidth >= 768;

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={handleClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(0.5px)",
          opacity: visible && !closing ? 1 : 0,
          transition: "opacity .25s ease",
          zIndex: 9998,
        }}
      />

      {/* SHEET */}
      <div
        ref={sheetRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          position: "fixed",
          left: isDesktop ? "auto" : 0,
          right: isDesktop ? 28 : 0,
          bottom: 0,
          width: isDesktop ? 460 : "100%",
          height: isDesktop ? 460 : "55vh",
          background: "#010102",
          color: "#fff",
          borderRadius: "38px 38px 0 0",
          transform:
            visible && !closing
              ? "translateY(0)"
              : "translateY(100%)",
          transition: "transform .32s cubic-bezier(.22,1,.36,1)",
          boxShadow: "0 -10px 32px rgba(0,0,0,.2)",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* BLOBS */}
        <div className="blob purple" />
        <div className="blob cyan" />
        <div className="blob teal" />
        <div className="blob blue" />
        <div className="blob indigo" />
        <div className="blob pink" />
        <div className="blob emerald" />

        {/* CONTENT */}
        <div style={{ position: "relative", zIndex: 1, height: "100%" }}>
          {/* HEADER */}
          <div
            style={{
              padding: "32px 35px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 21,
                fontWeight: 900,
              }}
            >
              <Sparkles size={20} color="#b51414" />
              KuzeyBatı AI Özeti
            </div>

            <button
              onClick={handleClose}
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              <ChevronDown size={30} />
            </button>
          </div>

          {/* BODY */}
          <div
            className="hide-scroll"
            style={{
              padding: "15px 44px",
              height: "calc(100% - 78px)",
              overflowY: "auto",
            }}
          >
            {canShow ? (
              <>
                {/* TITLE + DOT */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                    marginBottom: 22,
                  }}
                >
                  <span className="pulse-dot" />
                  <h2
                    style={{
                      fontSize: 30,
                      fontWeight: 900,
                      lineHeight: 1.15,
                    }}
                  >
                    {payload.title_ai}
                  </h2>
                </div>

                <p
                  style={{
                    fontSize: 17,
                    lineHeight: 1.85,
                    color: "#e5e7eb",
                    whiteSpace: "pre-line",
                  }}
                >
                  {payload.summary}
                </p>
              </>
            ) : (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#9ca3af",
                  textAlign: "center",
                  fontSize: 18,
                }}
              >
                <AlertTriangle size={30} style={{ marginBottom: 14 }} />
                Bu haber için yapay zeka özeti mevcut değil.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* STYLES */}
      <style>{`
        .blob {
          position: absolute;
          width: 520px;
          height: 520px;
          border-radius: 50%;
          filter: blur(180px);
          opacity: 0.1;
          animation: spin 6s linear infinite;
          pointer-events: none;
        }

        .purple { background:#4c1d95; top:-260px; left:-260px }
        .cyan { background:#155e75; top:10%; right:-260px; animation-duration:7s }
        .teal { background:#134e4a; top:45%; left:-240px; animation-duration:6.5s }
        .blue { background:#1e3a8a; bottom:-300px; right:20%; animation-duration:8s }
        .indigo { background:#312e81; top:-200px; right:10%; animation-duration:7.5s }
        .pink { background:#831843; bottom:-280px; left:25%; animation-duration:9s }
        .emerald { background:#022c22; bottom:10%; right:-200px; animation-duration:6.8s }

        @keyframes spin {
          from { transform: rotate(0deg) translateY(70px); }
          to { transform: rotate(360deg) translateY(70px); }
        }

        .pulse-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #b51414;
          margin-top: 10px;
          animation: pulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }

        @keyframes pulse {
          0% { opacity: .3 }
          50% { opacity: 1 }
          100% { opacity: .3 }
        }

        .hide-scroll::-webkit-scrollbar { display: none }
        .hide-scroll { scrollbar-width: none }
      `}</style>
    </>
  );
}
