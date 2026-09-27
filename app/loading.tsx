export default function Loading() {
  return (
    <div className="py-12" aria-label="Loading">
      <div className="h-8 w-1/3 animate-pulse rounded-lg bg-white/10" />
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-44 animate-pulse rounded-2xl bg-white/10" />
        ))}
      </div>
    </div>
  );
}
