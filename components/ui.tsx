import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("glass card-hover rounded-2xl p-5 sm:p-6", className)}>
      {children}
    </section>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  sub,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-cyan-300">
          {eyebrow}
        </p>
      )}
      <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">{title}</h2>
      {sub && <p className="mt-1 text-sm text-slate-400">{sub}</p>}
    </div>
  );
}

export function ScoreRing({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(100, Math.round(score)));
  const color = pct >= 75 ? "#22d3ee" : pct >= 50 ? "#60a5fa" : "#f59e0b";
  const r = 44;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-4" role="img" aria-label={`Score ${pct} out of 100`}>
      <svg width="110" height="110" viewBox="0 0 110 110" aria-hidden>
        <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(148,163,184,.2)" strokeWidth="10" />
        <circle
          cx="55"
          cy="55"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * pct) / 100}
          transform="rotate(-90 55 55)"
        />
        <text x="55" y="60" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="800">
          {pct}
        </text>
      </svg>
      <div>
        <p className="text-sm text-slate-400">Overall score</p>
        <p className="text-lg font-bold text-white">/ 100</p>
      </div>
    </div>
  );
}

export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2.5 py-1 text-xs font-medium text-cyan-200">
      {children}
    </span>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("animate-pulse rounded-xl bg-white/10", className)} />;
}
