export default function FeedCardSkeleton() {
  return (
    <div className="rounded-3xl border border-black/5 bg-white shadow-sm animate-pulse">
      <div className="p-4 space-y-4">
        <div className="aspect-[4/3] rounded-2xl bg-black/10" />
        <div className="h-4 bg-black/10 rounded w-full" />
        <div className="h-4 bg-black/10 rounded w-[80%]" />
      </div>
    </div>
  );
}
