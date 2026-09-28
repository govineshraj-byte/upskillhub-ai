"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, ExternalLink, Star, BadgeCheck } from "lucide-react";
import { Card, SectionTitle, Chip, Skeleton } from "@/components/ui";
import { CAREER_FIELDS } from "@/lib/courses-data";

export default function CoursesPage() {
  return (
    <Suspense
      fallback={
        <div className="py-8" aria-label="Loading courses">
          <Skeleton className="h-8 w-1/2" />
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {[0, 1].map((i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
      }
    >
      <CoursesContent />
    </Suspense>
  );
}

function CoursesContent() {
  const params = useSearchParams();
  const initialField = params.get("field") ?? "all";
  const validInitial = CAREER_FIELDS.some((f) => f.slug === initialField)
    ? initialField
    : "all";

  const [q, setQ] = useState("");
  const [field, setField] = useState(validInitial);

  const filtered = useMemo(() => {
    return CAREER_FIELDS.filter((f) => {
      const matchField = field === "all" || f.slug === field;
      const needle = q.trim().toLowerCase();
      if (!needle) return matchField;
      const hay = `${f.name} ${f.tagline} ${f.skills.join(" ")} ${f.courses.map((c) => c.title).join(" ")}`.toLowerCase();
      return matchField && hay.includes(needle);
    });
  }, [q, field]);

  return (
    <div className="py-8">
      <SectionTitle
        eyebrow="Learning paths"
        title="100% free courses for every major career field"
        sub="CSE, Software, Web, Python, Java, C/C++, AI, ML, Data Science, Analytics, GenAI, Cloud, DevOps, Security, Networks, Databases, UI/UX, Mobile, Business, Finance, Marketing, Design, Management, Engineering, Healthcare. Every course below is free to learn."
      />
      <Card>
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden />
            <label htmlFor="course-search" className="sr-only">Search careers or courses</label>
            <input
              id="course-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search: Python, cybersecurity, UI/UX, finance…"
              className="min-h-[44px] w-full rounded-xl border border-white/15 bg-black/40 pl-9 pr-3 text-sm text-white placeholder:text-slate-500"
            />
          </div>
          <label className="sr-only" htmlFor="field-filter">Filter by field</label>
          <select
            id="field-filter"
            value={field}
            onChange={(e) => setField(e.target.value)}
            className="min-h-[44px] rounded-xl border border-white/15 bg-black/40 px-3 text-sm text-white"
          >
            <option value="all">All fields</option>
            {CAREER_FIELDS.map((f) => (
              <option key={f.slug} value={f.slug}>{f.name}</option>
            ))}
          </select>
        </div>
        <p className="mt-2 text-xs text-slate-500" role="status">
          Showing {filtered.length} of {CAREER_FIELDS.length} fields · all courses free
        </p>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {filtered.map((f) => (
          <Card key={f.slug}>
            <div id={f.slug} className="scroll-mt-24 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-white">{f.name}</h2>
              <div className="flex gap-1.5">
                <Chip>{f.demand} demand</Chip>
                <Chip>{f.avgSalary}</Chip>
              </div>
            </div>
            <p className="mt-1 text-sm text-slate-400">{f.tagline}</p>
            <h3 className="mt-3 text-sm font-semibold text-white">Key skills</h3>
            <div className="mt-1.5 flex flex-wrap gap-1.5">{f.skills.map((s) => <Chip key={s}>{s}</Chip>)}</div>
            <h3 className="mt-4 text-sm font-semibold text-white">Recommended courses (free)</h3>
            <ul className="mt-2 space-y-2">
              {f.courses.map((c) => (
                <li key={c.title} className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-white">{c.title}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{c.provider} · {c.level} · {c.duration}</p>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-amber-300"><Star className="h-3.5 w-3.5" aria-hidden />{c.rating}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <a href={c.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-cyan-300 hover:underline">
                      Open course <ExternalLink className="h-3 w-3" aria-hidden />
                    </a>
                    {c.free && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-xs font-semibold text-emerald-300">
                        <BadgeCheck className="h-3 w-3" aria-hidden /> Free
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-xl bg-white/5 p-3">
                <p className="font-semibold text-white">Projects</p>
                <ul className="mt-1 list-disc space-y-0.5 pl-4 text-slate-300">{f.projects.map((p) => <li key={p}>{p}</li>)}</ul>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <p className="font-semibold text-white">Certifications</p>
                <ul className="mt-1 list-disc space-y-0.5 pl-4 text-slate-300">{f.certifications.map((p) => <li key={p}>{p}</li>)}</ul>
              </div>
            </div>
            <div className="mt-3 flex gap-3 text-sm">
              <Link href="/roadmap" className="font-medium text-cyan-300 hover:underline">Get AI roadmap →</Link>
              <Link href="/assistant" className="font-medium text-cyan-300 hover:underline">Ask AI about this →</Link>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card><p className="py-8 text-center text-sm text-slate-400">No matches. Try “data”, “cloud” or “design”.</p></Card>
        )}
      </div>
    </div>
  );
}
