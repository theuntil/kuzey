"use client";

export default function FeedCardSkeleton() {
  return (
    <div className="rounded-3xl border border-black/5 bg-white shadow-sm overflow-hidden animate-pulse">
      <div className="w-full p-4 md:p-6">
        <div className="rounded-2xl border border-black/5 overflow-hidden aspect-[4/3] bg-black/10" />

        <div className="mt-4 space-y-2">
          <div className="h-4 w-full rounded bg-black/10" />
          <div className="h-4 w-[85%] rounded bg-black/10" />
          <div className="h-4 w-[70%] rounded bg-black/10" />
        </div>
      </div>
    </div>
  );
}
