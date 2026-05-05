export const QuoteCardSkeleton = () => (
  <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
    <div className="text-6xl font-serif text-primary-100">&quot;</div>
    <div className="mt-3 space-y-3">
      <div className="h-4 w-11/12 animate-pulse rounded bg-neutral-200" />
      <div className="h-4 w-10/12 animate-pulse rounded bg-neutral-200" />
      <div className="h-4 w-7/12 animate-pulse rounded bg-neutral-200" />
    </div>
    <div className="mt-5 h-3 w-32 animate-pulse rounded bg-neutral-200" />
    <div className="mt-5 flex gap-2">
      <div className="h-6 w-16 animate-pulse rounded-full bg-neutral-200" />
      <div className="h-6 w-20 animate-pulse rounded-full bg-neutral-200" />
    </div>
  </div>
);
