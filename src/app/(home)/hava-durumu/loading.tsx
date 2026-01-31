export default function Loading() {
  return (
    <main className="min-h-dvh">
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="mb-6 h-10 w-48 animate-pulse rounded-xl bg-zinc-200" />
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="h-[320px] animate-pulse rounded-3xl border border-zinc-200 bg-white" />
          </div>
          <div className="lg:col-span-5">
            <div className="h-[320px] animate-pulse rounded-3xl border border-zinc-200 bg-white" />
          </div>
        </div>
      </div>
    </main>
  );
}
