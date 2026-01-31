export default function FeedSkeleton() {
  return (
    <div className="rounded-2xl border animate-pulse overflow-hidden">
      <div className="aspect-[4/3] bg-neutral-200" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-neutral-200 rounded" />
        <div className="h-3 w-4/5 bg-neutral-200 rounded" />
      </div>
    </div>
  );
}
