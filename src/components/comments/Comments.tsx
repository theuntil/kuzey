"use client";

/* ======================================================
   IMPORTS
====================================================== */

import { useEffect, useState, useRef, useCallback } from "react";
import { useToast } from "@/components/ui/ToastProvider";
import {
  Send,
  Ban,
  Loader2,
  MessageCircle,
} from "lucide-react";
import clsx from "clsx";

/* ======================================================
   TYPES
====================================================== */

type Comment = {
  id: string;
  name: string;
  content: string;
  created_at: string;
};

type Lang = "tr" | "en";

/* ======================================================
   TRANSLATIONS
====================================================== */

const TEXT = {
  tr: {
    title: "Yorumlar",
    name: "Ad Soyad",
    placeholder: "Yorumunuzu yazın…",
    send: "Gönder",
    sending: "Gönderiliyor…",
    success: "Yorumunuz eklendi",
    empty: "Ad ve yorum boş olamaz",
    banned: "Yorum yapmanız kalıcı olarak engellendi",
    limit: "Bu habere en fazla 3 yorum yapabilirsiniz",
    rule: "Kurallara uygun yorum yapın",
    blocked: "Engellendi",
    justNow: "az önce",

    /* EMPTY STATE */
    emptyTitle: "Düşüncelerini insanlarla paylaş!",
    emptyDesc: "Bu haber hakkında ilk yorumu sen yap.",
  },
  en: {
    title: "Comments",
    name: "Full name",
    placeholder: "Write your comment…",
    send: "Send",
    sending: "Sending…",
    success: "Comment posted",
    empty: "Name and comment are required",
    banned: "You are permanently banned from commenting",
    limit: "You can post up to 3 comments",
    rule: "Please follow the rules",
    blocked: "Blocked",
    justNow: "just now",

    /* EMPTY STATE */
    emptyTitle: "Share your thoughts with others!",
    emptyDesc: "Be the first to comment on this news.",
  },
};

/* ======================================================
   HELPERS
====================================================== */

function formatDate(date: string, lang: Lang) {
  const d = new Date(date);
  const diff = Date.now() - d.getTime();

  if (diff < 60_000) return TEXT[lang].justNow;

  return d.toLocaleDateString(
    lang === "en" ? "en-US" : "tr-TR",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

function getAvatarColor(letter: string) {
  const colors = [
    "from-indigo-500 to-purple-600",
    "from-emerald-500 to-teal-600",
    "from-pink-500 to-rose-600",
    "from-sky-500 to-blue-600",
    "from-amber-500 to-orange-600",
  ];
  const index = letter.charCodeAt(0) % colors.length;
  return colors[index];
}

/* ======================================================
   AVATAR
====================================================== */

function Avatar({ name }: { name: string }) {
  const letter = name?.trim()?.[0]?.toUpperCase() || "?";
  const color = getAvatarColor(letter);

  return (
    <div
      className={clsx(
        "flex h-11 w-11 shrink-0 items-center justify-center",
        "rounded-full text-sm font-semibold text-white",
        "bg-gradient-to-br",
        color
      )}
    >
      {letter}
    </div>
  );
}

/* ======================================================
   MAIN COMPONENT
====================================================== */

export default function Comments({
  newsId,
  lang = "tr",
}: {
  newsId: string;
  lang?: Lang;
}) {
  const t = TEXT[lang];
  const { show } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);

  /* ---------------- STATE ---------------- */

  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [animatingId, setAnimatingId] = useState<string | null>(null);

  /* ---------------- FETCH ---------------- */

  const loadComments = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/comments?newsId=${newsId}`);
    const data = await res.json();
    setComments(data.comments ?? []);
    setLoading(false);
  }, [newsId]);

  /* ---------------- SUBMIT ---------------- */

  async function submit() {
    if (!name.trim() || !content.trim()) {
      show(t.empty, "error");
      return;
    }

    if (blocked || sending) return;

    setSending(true);

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        news_id: newsId,
        name,
        content,
      }),
    });

    const data = await res.json();
    setSending(false);

    if (!res.ok) {
      if (data.code === "BANNED" || data.code === "BANNED_WORD") {
        setBlocked(true);
        show(t.banned, "error");
      } else if (data.code === "LIMIT") {
        show(t.limit, "error");
      } else {
        show("Error", "error");
      }
      return;
    }

    setName("");
    setContent("");
    show(t.success, "success");
    audioRef.current?.play();

    await loadComments();

    setAnimatingId(data.newId);
    setTimeout(() => setAnimatingId(null), 600);
  }

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <section className="mt-10 w-full">
      {/* TITLE */}
      {!loading && comments.length > 0 && (
        <div className="mb-10 flex items-center gap-3 text-neutral-900">
          <MessageCircle size={20} />
          <h3 className="text-lg font-semibold">
            {t.title}
          </h3>
        </div>
      )}

      {/* COMMENTS LIST */}
      <div className="space-y-6">
        {comments.map((c) => (
          <div
            key={c.id}
            className={clsx(
              "flex gap-4 rounded-3xl",
              "bg-neutral-100/80 p-5",
              "transition-all duration-500",
              animatingId === c.id &&
                "animate-[commentIn_0.6s_ease-out]"
            )}
          >
            <Avatar name={c.name} />

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-neutral-900">
                  {c.name}
                </span>
                <span className="text-xs text-neutral-400">
                  {formatDate(c.created_at, lang)}
                </span>
              </div>

              <p className="mt-1 text-sm leading-relaxed text-neutral-800">
                {c.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE TITLE */}
      {!loading && comments.length === 0 && (
        <div className="mb-2 px-4">
          <h3 className="text-4xl font-extrabold text-neutral-900">
            {t.emptyTitle}
          </h3>
          <p className="mt-2 text-sm text-neutral-500">
            {t.emptyDesc}
          </p>
        </div>
      )}

      {/* INPUT AREA */}
      <div className="mt-8 flex gap-4 rounded-3xl bg-neutral-200/70 p-8 backdrop-blur">
        <Avatar name={name || "?"} />

        <div className="flex-1">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.name}
            disabled={blocked}
            className={clsx(
              "mb-3 w-full rounded-2xl px-4 py-2",
              "bg-white/80 text-sm outline-none",
              "transition focus:shadow-md",
              blocked && "opacity-60"
            )}
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t.placeholder}
            rows={3}
            disabled={blocked}
            className={clsx(
              "w-full resize-none rounded-2xl px-4 py-3",
              "bg-white/80 text-sm outline-none",
              "transition focus:shadow-md",
              blocked && "opacity-60"
            )}
          />

          <div className="mt-4 flex items-center justify-between">
            {blocked ? (
              <div className="flex items-center gap-2 text-sm text-red-500">
                <Ban size={16} />
                {t.blocked}
              </div>
            ) : (
              <span className="text-xs text-neutral-500">
                {t.rule}
              </span>
            )}

            <button
              onClick={submit}
              disabled={sending || blocked}
              className={clsx(
                "flex items-center gap-2 rounded-full",
                "bg-black px-6 py-2 text-sm text-white",
                "transition active:scale-95",
                "disabled:opacity-40"
              )}
            >
              {sending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {t.sending}
                </>
              ) : (
                <>
                  <Send size={16} />
                  {t.send}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* AUDIO */}
      <audio ref={audioRef} src="/sounds/begenme.mp3" preload="auto" />
    </section>
  );
}
