"use client";

import Image from "next/image";

export default function AdFreeHero() {
  return (
    <section className="relative px-2 lg:px-9 mt-8">
      <div className="relative overflow-hidden rounded-[38px] bg-black text-white">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-16 pt-15 lg:pt-16">
          <div className="flex flex-col lg:flex-row lg:items-end">
            {/* TEXT */}
            <div className="flex-1 text-center lg:text-left lg:pl-20 flex flex-col justify-center pb-10 lg:pb-16">
              <h1 className="text-4xl font-semibold leading-tight">
                Gözü yormayan
                <br />
                Reklamsız
                <br />
                Haber deneyimi
              </h1>

              <div className="mt-10 flex flex-row gap-4 justify-center lg:justify-start">
                <StoreButton
                  href="#"
                  img="/appstore.png"
                  top="Hemen indirin"
                  bottom="App Store"
                />
                <StoreButton
                  href="#"
                  img="/googleplay.webp"
                  top="Hemen İndirin"
                  bottom="Google Play"
                />
              </div>
            </div>

            {/* DESKTOP IMAGE */}
            <div className="hidden lg:flex flex-1 justify-end self-end">
              <Image
                src="/snap.png"
                alt="App preview"
                width={420}
                height={860}
                priority
                className="w-[420px] h-auto object-contain select-none"
              />
            </div>
          </div>
        </div>

        {/* MOBILE IMAGE */}
        <div className="lg:hidden w-full mt-12">
          <Image
            src="/snap.png"
            alt="App preview"
            width={500}
            height={900}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- */

function StoreButton({
  href,
  img,
  top,
  bottom,
}: {
  href: string;
  img: string;
  top: string;
  bottom: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 bg-white text-black rounded-xl h-[56px] w-[150px] px-4 shadow-md hover:shadow-xl transition flex-shrink-0"
      style={{ animation: "breathe 6s ease-in-out infinite" }}
    >
      <Image src={img} alt="" width={26} height={26} />

      <div className="flex flex-col leading-tight whitespace-nowrap">
        <span className="text-[10px] opacity-70">{top}</span>
        <span className="text-[15px] font-semibold">{bottom}</span>
      </div>
    </a>
  );
}
