"use client";

import Image from "next/image";

export default function AdFreeHero() {
  return (
    <section className="relative px-3 lg:px-10 mt-8">
      <div className="relative overflow-hidden rounded-[38px] bg-black text-white">

        {/* DESKTOP / TABLET */}
        <div className="hidden lg:block">
          <div className="max-w-7xl mx-auto px-14 pt-20">
            <div className="grid grid-cols-2 items-end">

              {/* LEFT – TEXT (50%) */}
              <div className="pb-20">
                <h1 className="text-[35px] font-semibold leading-tight tracking-tight">
                  Reklamsız
                  <br />
                  Haber deneyimi
                </h1>

                <div className="mt-12 flex gap-4">
                  <StoreButton
                    href="#"
                    img="/appstore.png"
                    top="Hemen indirin"
                    bottom="App Store"
                  />
                  <StoreButton
                    href="#"
                    img="/googleplay.webp"
                    top="Hemen indirin"
                    bottom="Google Play"
                  />
                </div>
              </div>

              {/* RIGHT – IMAGE (50%) */}
              <div className="relative flex justify-center">
                <Image
                  src="/snap.png"
                  alt="App preview"
                  width={520}
                  height={1040}
                  priority
                  className="w-[420px] xl:w-[460px] 2xl:w-[500px] h-auto object-contain select-none"
                />
              </div>

            </div>
          </div>
        </div>

        {/* MOBILE */}
        <div className="lg:hidden px-6 pt-14">
          <h1 className="text-4xl font-semibold leading-tight text-center">
            Gözü yormayan
            <br />
            Reklamsız
            <br />
            Haber deneyimi
          </h1>

          <div className="mt-8 flex justify-center gap-4">
            <StoreButton
              href="#"
              img="/appstore.png"
              top="Hemen indirin"
              bottom="App Store"
            />
            <StoreButton
              href="#"
              img="/googleplay.webp"
              top="Hemen indirin"
              bottom="Google Play"
            />
          </div>

          <div className="mt-12 flex justify-center">
            <Image
              src="/snap.png"
              alt="App preview"
              width={300}
              height={600}
              priority
              className="w-[260px] h-auto object-contain"
            />
          </div>
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
      className="flex items-center gap-3 bg-white text-black rounded-xl h-[54px] w-[165px] px-4 shadow-md hover:shadow-lg transition"
    >
      <Image src={img} alt="" width={24} height={24} />

      <div className="flex flex-col leading-tight">
        <span className="text-[10px] opacity-60">{top}</span>
        <span className="text-[15px] font-semibold">{bottom}</span>
      </div>
    </a>
  );
}
