"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Play, Images } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

/* ----------------------------------
   SABİTLER
---------------------------------- */
const STORAGE =
  "https://supabase.kuzeybatihaber.cloud/storage/v1/object/public/news/";
const PLACEHOLDER =
  "https://supabase.kuzeybatihaber.cloud/storage/v1/object/public/news/images/1.jpg";

/* ----------------------------------
   HELPERS
---------------------------------- */
function resolveMedia(src: string | null) {
  if (!src) return PLACEHOLDER;
  if (src.startsWith("http")) return src;
  return STORAGE + src.replace(/^\/+/, "");
}

/* ----------------------------------
   TYPES
---------------------------------- */
type Props = {
  cover: string | null;
  images?: string[] | null;
  videoUrl?: string | null;
  alt: string;
};

/* ----------------------------------
   COMPONENT
---------------------------------- */
export default function NewsImage({
  cover,
  images,
  videoUrl,
  alt,
}: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [startIndex, setStartIndex] = useState<number | null>(null);

  const swiperRef = useRef<any>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const media = useMemo(() => {
    const list: { type: "image" | "video"; src: string }[] = [];

    if (cover) list.push({ type: "image", src: resolveMedia(cover) });

    images?.forEach((img) =>
      list.push({ type: "image", src: resolveMedia(img) })
    );

    if (videoUrl) {
      list.push({ type: "video", src: resolveMedia(videoUrl) });
    }

    return list;
  }, [cover, images, videoUrl]);

  /* ----------------------------------
     KEYBOARD CONTROLS
  ---------------------------------- */
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeGallery();
      if (e.key === "ArrowRight") swiperRef.current?.slideNext();
      if (e.key === "ArrowLeft") swiperRef.current?.slidePrev();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
  const openLast = () => {
    if (!media.length) return;

    const lastIndex = media.length - 1;

    setStartIndex(lastIndex); // 🔑 sadece hedefi ayarla
    setOpen(true);            // 🔑 galeriyi aç
  };

  window.addEventListener("openLastMedia", openLast);
  return () => window.removeEventListener("openLastMedia", openLast);
}, [media]);

 

  /* ----------------------------------
     HELPERS
  ---------------------------------- */
function openGallery() {
  setStartIndex(0); // 👈 normal açılış = ilk görsel
  setOpen(true);
}


  function closeGallery() {
  videoRefs.current.forEach((v) => {
    if (v) v.pause();
  });

  setOpen(false);
  setActive(0);
  setStartIndex(null);
}


  function handleSlideChange(index: number) {
    setActive(index);

    videoRefs.current.forEach((video, i) => {
      if (!video) return;

      if (media[i]?.type === "video" && i === index) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }
useEffect(() => {
  if (!open) return;

  const body = document.body;
  const html = document.documentElement;
  const scrollY = window.scrollY;

  body.style.position = "fixed";
  body.style.top = `-${scrollY}px`;
  body.style.left = "0";
  body.style.right = "0";
  body.style.width = "100%";
  body.style.overflow = "hidden";

  html.style.overscrollBehavior = "none";

  return () => {
    body.style.position = "";
    body.style.top = "";
    body.style.left = "";
    body.style.right = "";
    body.style.width = "";
    body.style.overflow = "";
    html.style.overscrollBehavior = "";
    window.scrollTo(0, scrollY);
  };
}, [open]);

  const hasGallery = media.length > 1;

  return (
    <>
      {/* COVER */}
    <div
  onClick={openGallery}
  className="relative aspect-16/9 rounded-2xl overflow-hidden bg-neutral-100
  cursor-zoom-in group
  opacity-0 scale-[1.02]
  animate-fade-in"
>


        <Image
          src={resolveMedia(cover)}
          alt={alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />


{/* GALERİ HINT TEXT */}
{hasGallery && (
  <div className="absolute bottom-3 left-3 z-10">
    <div className="
      text-[9px] md:text-xs
      text-white/90
      bg-black/60 backdrop-blur
      px-3 py-1.5
      rounded-full
      flex items-center gap-1
    ">
     
      <span>Haber galerisini görmek için tıkla</span>
    </div>
  </div>
)}


        {(hasGallery || videoUrl) && (
          <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full flex items-center gap-2">
            <Images size={14} />
            {videoUrl && <Play size={12} />}
            {media.length}
          </div>
        )}
      </div>

      {/* FULLSCREEN */}
      {open && (
  <div
    className="fixed inset-0 z-[100] bg-black overflow-hidden overscroll-contain touch-none"
    style={{ height: "100dvh" }}
  >

          {/* CLOSE */}
          <button
            onClick={closeGallery}
            className="absolute top-4 right-4 z-[110] text-white p-2 hover:opacity-70"
          >
            <X size={28} />
          </button>

          {/* LEFT */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-[110] text-white p-3 hover:opacity-70"
          >
            <ChevronLeft size={36} />
          </button>

          {/* RIGHT */}
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-[110] text-white p-3 hover:opacity-70"
          >
            <ChevronRight size={36} />
          </button>

          {/* SLIDER */}
         <Swiper
  modules={[Navigation]}
  onSwiper={(s) => {
    swiperRef.current = s;

    if (startIndex !== null) {
      s.slideTo(startIndex, 0);   // 🔑 GERÇEK slide değişimi
      setActive(startIndex);      // 🔑 counter senkron
      setStartIndex(null);        // 🔑 bir kere çalışsın
    }
  }}
  onSlideChange={(s) => handleSlideChange(s.activeIndex)}
  className="w-full h-full"
>

            {media.map((item, i) => (
              <SwiperSlide key={i}>
                <div className="w-full h-full flex items-center justify-center">
                  {item.type === "image" ? (
                    <TransformWrapper>
                      <TransformComponent>
                        <Image
                          src={item.src}
                          alt={alt}
                          width={1920}
                          height={1080}
                          className="max-h-screen w-auto object-contain"
                        />
                      </TransformComponent>
                    </TransformWrapper>
                  ) : (
                    <video
                      ref={(el) => {
                        videoRefs.current[i] = el;
                      }}
                      src={item.src}
                      controls
                      playsInline
                      preload="metadata"
                      className="max-h-screen w-auto"
                    />
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* COUNTER */}
          <div className="pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 z-[120] text-white text-sm bg-black/50 px-3 py-1 rounded-full">
            {active + 1} / {media.length}
          </div>
        </div>
      )}
    </>
  );
}
          