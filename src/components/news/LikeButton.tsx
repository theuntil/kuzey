"use client";


import { useEffect, useRef, useState } from "react";
import { Heart } from "lucide-react";
import { getOrCreateVisitorId } from "@/lib/visitor";
import clsx from "clsx";

export default function LikeButton({ newsId }: { newsId: string }) {
  const visitorId = getOrCreateVisitorId();

  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [animate, setAnimate] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* 🔊 Ses preload */
  useEffect(() => {
    audioRef.current = new Audio("/sounds/begenme.mp3");
    audioRef.current.volume = 0.6;
  }, []);

  /* 1️⃣ İlk yükleme – gerçek veri */
  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const res = await fetch("/api/news/like-state", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newsId, visitorId }),
        });

        if (!res.ok) return;

        const data = await res.json();
        if (!alive) return;

        setLiked(Boolean(data.liked));
        setCount(Number(data.count ?? 0));
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [newsId, visitorId]);

  /* 2️⃣ Optimistic toggle */
  async function toggle() {
    if (loading || sending) return;

    const nextLiked = !liked;

    // 🔥 UI anında
    setSending(true);
    setLiked(nextLiked);
    setCount(prev => (nextLiked ? prev + 1 : Math.max(prev - 1, 0)));

    // 🎉 Animasyon + ses sadece like atınca
    if (nextLiked) {
      setAnimate(true);
      audioRef.current?.play().catch(() => {});
      setTimeout(() => setAnimate(false), 300);
    }

    try {
      await fetch("/api/news/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newsId, visitorId }),
      });
    } catch {
      // ❌ rollback
      setLiked(!nextLiked);
      setCount(prev => (nextLiked ? Math.max(prev - 1, 0) : prev + 1));
    } finally {
      setSending(false);
    }
  }

  /* ⏳ Skeleton – layout SABİT */
  if (loading) {
    return (
      <div className="flex items-center gap-1 text-xs text-neutral-400 min-w-[42px]">
        <Heart size={18} />
        <span className="w-[18px] text-center">—</span>
      </div>
    );
  }

  return (
    <button
      onClick={toggle}
      disabled={sending}
      aria-label="Like"
      className={clsx(
        "flex items-center gap-1 text-xs select-none transition-colors",
        liked
          ? "text-red-600"
          : "text-neutral-600 hover:text-red-600",
        sending && "opacity-70"
      )}
    >
      <span
        className={clsx(
          "inline-flex ",
          animate && "scale-125"
        )}
      >
        <Heart
          size={18}
          className={clsx(
            "",
            liked && "fill-current"
          )}
        />
      </span>

      {/* 🔒 Sabit genişlik → kayma yok */}
      <span className="w-[18px] text-center tabular-nums">
        {count}
      </span>
    </button>
  );
}

