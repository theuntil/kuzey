export default function CategoryFeedSkeleton() {
  return (
    <div className="h-full rounded-[28px] bg-white shadow overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="p-6 space-y-3">
        <div className="h-4 w-1/2 bg-gray-200 rounded" />
        <div className="h-6 bg-gray-200 rounded" />
        <div className="h-6 w-5/6 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
