"use client";

import { useState } from "react";
import { Loader2, Map as MapIcon } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui";

type Phase = {
  title: string;
  weeks: string;
  goals: string[];
  skills: string[];
  courses: string[];
  projects: string[];
  certifications: string[];
};

type Roadmap = {
  headline: string;
  overview: string;
  phases: Phase[];
  resumePlan: string[];
  interviewPlan: string[];
  jobPlan: string[];
  weeklySchedule: string;
  successMetrics: string[];
};

export default function RoadmapPage() {
  const [currentStage, setCurrentStage] = useState("2nd-year B.Tech CSE student");
  const [targetCareer, setTargetCareer] = useState("Data Analyst");
  const [skills, setSkills] = useState("Python basics, Excel, SQL basics");
  const [timeline, setTimeline] = useState("6 months");
  const [hours, setHours] = useState("8-10 hours");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);

  async function generate() {
    setLoading(true);
    setError("");
    setRoadmap(null);
    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentStage, targetCareer, skills, timeline, hoursPerWeek: hours }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Roadmap failed.");
      setRoadmap(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Roadmap failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-8">
      <SectionTitle
        eyebrow="Roadmap"
        title="Personalized Career → Job Roadmap"
        sub="Career → Skills → Courses → Projects → Certifications → Resume → Interview → Job."
      />
      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <Card>
          <div className="grid gap-3">
            <Field id="stage" label="Where are you now?">
              <input id="stage" value={currentStage} onChange={(e) => setCurrentStage(e.target.value)} className="mt-1 min-h-[44px] w-full rounded-xl border border-white/15 bg-black/40 px-3 text-sm text-white" />
            </Field>
            <Field id="target" label="Target career / role">
              <input id="target" value={targetCareer} onChange={(e) => setTargetCareer(e.target.value)} placeholder="e.g. AI Engineer, UI/UX Designer…" className="mt-1 min-h-[44px] w-full rounded-xl border border-white/15 bg-black/40 px-3 text-sm text-white" />
            </Field>
            <Field id="skills" label="Current skills">
              <textarea id="skills" value={skills} onChange={(e) => setSkills(e.target.value)} rows={3} className="mt-1 w-full rounded-xl border border-white/15 bg-black/40 p-3 text-sm text-white" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field id="timeline" label="Timeline">
                <input id="timeline" value={timeline} onChange={(e) => setTimeline(e.target.value)} className="mt-1 min-h-[44px] w-full rounded-xl border border-white/15 bg-black/40 px-3 text-sm text-white" />
              </Field>
              <Field id="hours" label="Hours / week">
                <input id="hours" value={hours} onChange={(e) => setHours(e.target.value)} className="mt-1 min-h-[44px] w-full rounded-xl border border-white/15 bg-black/40 px-3 text-sm text-white" />
              </Field>
            </div>
            <button onClick={generate} disabled={loading || !targetCareer.trim()} className="btn-glow flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <MapIcon className="h-4 w-4" aria-hidden />}
              {loading ? "Generating…" : "Generate Roadmap"}
            </button>
            {error && <div role="alert" className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}
          </div>
        </Card>

        <div className="space-y-4">
          {!roadmap && <Card><p className="py-10 text-center text-sm text-slate-400">Your week-by-week plan will appear here.</p></Card>}
          {roadmap && (
            <>
              <Card>
                <h2 className="text-lg font-bold text-white">{roadmap.headline}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{roadmap.overview}</p>
                <p className="mt-3 rounded-xl bg-cyan-400/10 p-3 text-sm text-cyan-100">Weekly schedule: {roadmap.weeklySchedule}</p>
              </Card>
              <div className="grid gap-4 md:grid-cols-2">
                {roadmap.phases?.map((p, i) => (
                  <Card key={i}>
                    <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">{p.weeks}</p>
                    <h3 className="mt-1 font-semibold text-white">{i + 1}. {p.title}</h3>
                    <List title="Goals" items={p.goals} />
                    <List title="Skills" items={p.skills} />
                    <List title="Courses" items={p.courses} />
                    <List title="Projects" items={p.projects} />
                    <List title="Certifications" items={p.certifications} />
                  </Card>
                ))}
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <Card><h3 className="font-semibold text-white">Resume plan</h3><Bullets items={roadmap.resumePlan} /></Card>
                <Card><h3 className="font-semibold text-white">Interview plan</h3><Bullets items={roadmap.interviewPlan} /></Card>
                <Card><h3 className="font-semibold text-white">Job plan</h3><Bullets items={roadmap.jobPlan} /></Card>
              </div>
              <Card>
                <h3 className="font-semibold text-white">Success metrics</h3>
                <Bullets items={roadmap.successMetrics} />
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-slate-200">{label}</label>
      {children}
    </div>
  );
}

function List({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <div className="mt-2">
      <p className="text-xs font-semibold text-slate-400">{title}</p>
      <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-slate-300">
        {items.map((x, i) => <li key={i}>{x}</li>)}
      </ul>
    </div>
  );
}

function Bullets({ items }: { items?: string[] }) {
  if (!items?.length) return <p className="text-sm text-slate-500">—</p>;
  return (
    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
      {items.map((x, i) => <li key={i}>{x}</li>)}
    </ul>
  );
}
