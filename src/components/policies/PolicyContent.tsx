"use client";

import { useEffect, useState } from "react";

export default function PolicyContent({ policy }: any) {
  const [mounted, setMounted] = useState(false);
  const [updated, setUpdated] = useState("");

  useEffect(() => {
    setMounted(true);

    if (policy?.updatedAt) {
      const d = new Date(policy.updatedAt);
      setUpdated(d.toLocaleDateString("tr-TR"));
    }
  }, [policy]);

  if (!policy) return null;

  return (
    <article
      suppressHydrationWarning
      className="
        rounded-2xl
        border border-white/10
        bg-white
        shadow-xl
        p-6 md:p-10
      "
    >
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-black">
          {policy.title}
        </h1>

        {mounted && updated && (
          <p className="mt-2 text-sm text-gray-400">
            Son güncelleme: {updated}
          </p>
        )}
      </header>

      <div className="prose max-w-none">
        {policy.content.map((block: any, i: number) => {
          if (block.type === "p") return <p key={i}>{block.text}</p>;
          if (block.type === "h3")
            return (
              <h3 key={i} className="text-lg font-semibold">
                {block.text}
              </h3>
            );
          return null;
        })}
      </div>
    </article>
  );
}
