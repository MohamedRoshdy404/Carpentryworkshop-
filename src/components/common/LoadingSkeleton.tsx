export function LoadingSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-sm"
        >
          <div className="h-72 animate-pulse bg-stone-200" />
          <div className="space-y-3 p-5">
            <div className="h-4 w-24 animate-pulse rounded-full bg-stone-200" />
            <div className="h-6 w-3/4 animate-pulse rounded-full bg-stone-200" />
            <div className="h-5 w-1/3 animate-pulse rounded-full bg-stone-200" />
            <div className="h-10 w-full animate-pulse rounded-full bg-stone-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
