import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[100svh] flex flex-col items-center justify-center px-6 text-center ">
      {/* ICON */}
      <div className="relative w-30 h-30 sm:w-52 sm:h-42 mb-6">
        <Image
          src="/404.apng"
          alt="404 Not Found"
          fill
          priority
          className="object-contain"
        />
      </div>

      {/* TEXT */}
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-4">
        Sayfa Bulunamadı
      </h1>

      {/* BUTTON */}
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-full bg-black text-white px-6 py-3 text-sm font-semibold transition hover:bg-black/85"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
