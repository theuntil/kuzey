"use client";


import Image from "next/image";
import {
  X,
  Twitter,
  Facebook,
  Linkedin,
  MessageCircle,
  Link as LinkIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  source: string | null;
  image: string;
  url: string; // boş gelse bile sorun yok
};

export default function ShareSheet({
  open,
  onClose,
  title,
  source,
  image,
  url,
}: Props) {
  const toast = useToast();
  const [visible, setVisible] = useState(false);

  // 🔒 TEK GERÇEK KAYNAK
  const [currentUrl, setCurrentUrl] = useState("");
  const [isEn, setIsEn] = useState(false);

  /* ===============================
     MOD + URL TESPİTİ (KESİN DOĞRU)
     =============================== */
  useEffect(() => {
    if (!open) return;

    if (typeof window !== "undefined") {
      const href = window.location.href;
      const pathname = window.location.pathname || "";

      setCurrentUrl(href);

      // 🇹🇷 default, 🇬🇧 sadece /en ise
      setIsEn(pathname === "/en" || pathname.startsWith("/en/"));
    }
  }, [open]);

  const copyText = isEn ? "Copy link" : "Bağlantıyı kopyala";
  const toastCopied = isEn ? "Link copied" : "Bağlantı kopyalandı";
  const toastFail = isEn ? "Copy failed" : "Kopyalama başarısız";

  /* ---------------- ANIMATION CONTROL ---------------- */
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [open]);

  if (!open) return null;

  function close() {
    setVisible(false);
    setTimeout(onClose, 180);
  }

  /* ---------------- COPY LINK (KESİN DOĞRU) ---------------- */
  function copyLink() {
    try {
      const finalUrl = currentUrl || url;
      if (!finalUrl) throw new Error("empty url");

      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(finalUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = finalUrl;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      toast.show(toastCopied, "success");
      close();
    } catch {
      toast.show(toastFail, "error");
    }
  }

  /* ---------------- SHARE HANDLER ---------------- */
  function shareAndClose(shareUrl: string) {
    window.open(shareUrl, "_blank", "noopener,noreferrer");
    close();
  }

  const shareBase = encodeURIComponent(currentUrl || url || "");

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={close}
        className={`fixed inset-0 z-40 bg-black/25 backdrop-blur-[0.8px]
        transition-opacity duration-200
        ${visible ? "opacity-100" : "opacity-0"}`}
      />

      {/* DESKTOP */}
      <div
        onClick={close}
        className="hidden md:flex fixed inset-0 z-50 items-center justify-center"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`w-full max-w-sm rounded-3xl
          bg-white text-neutral-900
          p-6 shadow-xl
          transition-all duration-200
          ${visible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
        >
          <Header image={image} title={title} source={source} />

          <Icons
            url={shareBase}
            onShare={shareAndClose}
          />

          <button
            onClick={copyLink}
            className="mt-4 h-11 w-full
            flex items-center justify-center gap-2
            rounded-xl border text-xs
            hover:bg-neutral-100 transition"
          >
            <LinkIcon size={14} />
            {copyText}
          </button>

          <button
            onClick={close}
            className="absolute top-3 right-4 text-neutral-400 hover:text-neutral-700"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* MOBILE */}
      <div
        onClick={close}
        className="md:hidden fixed inset-0 z-50 flex items-end"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`w-full rounded-t-3xl
          bg-white text-neutral-900
          px-6 pt-4 pb-6
          transition-transform duration-200
          ${visible ? "translate-y-0" : "translate-y-full"}`}
          style={{ height: "26vh" }}
        >
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={close}
              className="absolute right-5 top-4 text-neutral-400"
            >
              <X size={18} />
            </button>
          </div>

          <Header image={image} title={title} source={source} />

          <Icons
            url={shareBase}
            onShare={shareAndClose}
          />

          <button
            onClick={copyLink}
            className="mt-4 h-11 w-full
            flex items-center justify-center gap-2
            rounded-xl border text-xs
            hover:bg-neutral-100 transition"
          >
            <LinkIcon size={14} />
            {copyText}
          </button>
        </div>
      </div>
    </>
  );
}

/* ---------------- SUB COMPONENTS (AYNI) ---------------- */

function Header({
  image,
  title,
  source,
}: {
  image: string;
  title: string;
  source: string;
} | any) {
  return (
    <div className="flex gap-3 mb-4">
      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="min-w-0">
        {source && (
          <p className="text-[11px] text-neutral-500 mb-0.5">{source}</p>
        )}
        <h3 className="text-sm font-medium leading-snug line-clamp-2">
          {title}
        </h3>
      </div>
    </div>
  );
}

function Icons({
  url,
  onShare,
}: {
  url: string;
  onShare: (shareUrl: string) => void;
}) {
  return (
    <div className="flex items-center gap-5">
      <Icon onClick={() => onShare(`https://twitter.com/intent/tweet?url=${url}`)}>
        <Twitter size={16} />
      </Icon>
      <Icon onClick={() => onShare(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`)}>
        <Linkedin size={16} />
      </Icon>
      <Icon onClick={() => onShare(`https://www.facebook.com/sharer/sharer.php?u=${url}`)}>
        <Facebook size={16} />
      </Icon>
      <Icon onClick={() => onShare(`https://wa.me/?text=${url}`)}>
        <MessageCircle size={16} />
      </Icon>
    </div>
  );
}

function Icon({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-neutral-500 hover:text-neutral-900 transition"
    >
      {children}
    </button>
  );
}
