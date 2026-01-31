"use client";


import Image from "next/image";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { REACTIONS } from "@/lib/reactions";
import { getOrCreateVisitorId } from "@/lib/visitor";

type ReactionRow = {
  reaction: string;
  count: number;
  active: boolean;
};

export default function NewsReactions({ newsId }: { newsId: string }) {
  const visitorId = getOrCreateVisitorId();
  const [rows, setRows] = useState<ReactionRow[]>([]);

  async function load() {
    const res = await fetch("/api/news/reactions-state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newsId, visitorId }),
    });

    const data = await res.json();
    setRows(data);
  }

  async function toggle(reaction: string) {
    await fetch("/api/news/reactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newsId, visitorId, reaction }),
    });

    load(); // refresh state
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  const sorted = [...rows].sort((a, b) => b.count - a.count);

  return (
    <div className="mt-10 flex items-end gap-4">
      {sorted.map((r) => {
        const cfg = REACTIONS.find(x => x.key === r.reaction);
        if (!cfg) return null;

        return (
          <button
            key={r.reaction}
            onClick={() => toggle(r.reaction)}
            className="flex flex-col items-center gap-2 transition"
            style={{ transform: `translateY(-${r.count * 2}px)` }}
          >
            <div
              className={clsx(
                "rounded-full border bg-white p-2 shadow-sm",
                r.active && "ring-2 ring-black"
              )}
            >
              <Image
                src={cfg.icon}
                alt={cfg.label}
                width={32}
                height={32}
              />
            </div>

            <span className="text-xs font-semibold text-neutral-600">
              {r.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
