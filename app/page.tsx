import Link from "next/link";
import {
  Bot,
  FileSearch,
  Briefcase,
  Map,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Card, SectionTitle, Chip } from "@/components/ui";
import { CAREER_FIELDS } from "@/lib/courses-data";

const features = [
  {
    icon: Bot,
    title: "AI Career Assistant",
    desc: "Guidance, course picks, skill-gap analysis, interview prep and roadmaps.",
    href: "/assistant",
  },
  {
    icon: FileSearch,
    title: "AI Resume Analyzer",
    desc: "Upload PDF/DOCX. Get Resume Score /100, strengths, gaps and fixes.",
    href: "/resume-analyzer",
  },
  {
    icon: Briefcase,
    title: "Company / Job Matching",
    desc: "Paste any JD. Get Match Score, missing skills, keywords and projects.",
    href: "/job-match",
  },
  {
    icon: Map,
    title: "Personalized Roadmap",
    desc: "Career → Skills → Courses → Projects → Certs → Resume → Interview → Job.",
    href: "/roadmap",
  },
];

export default function Home() {
  return (
    <div className="py-8 sm:py-12">
      {/* HERO */}
      <section className="glass relative overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-14" aria-labelledby="hero-title">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-blue-600/25 blur-3xl"
        />
        <div className="relative grid items-center gap-8 lg:grid-cols-2">
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              <Chip>Live AI backend</Chip>
              <Chip>Resume Score /100</Chip>
              <Chip>Job Match /100</Chip>
            </div>
            <h1 id="hero-title" className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              Your AI-powered <span className="glow-text">career guidance</span> + resume + learning platform
            </h1>
            <p className="mt-4 max-w-xl text-sm text-slate-300 sm:text-base">
              Chat with an AI mentor, analyze your resume, match any job description, and follow a
              personalized roadmap across 20+ career fields — CSE, AI/ML, Data, Cloud, DevOps,
              Cybersecurity, UI/UX, Business, Finance, Healthcare and more.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/assistant"
                className="btn-glow inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white"
              >
                <Sparkles className="h-4 w-4" aria-hidden /> Start with AI Mentor
              </Link>
              <Link
                href="/resume-analyzer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-white/5 px-5 py-3 text-sm font-semibold text-cyan-200 hover:bg-white/10"
              >
                Analyze Resume <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-300" aria-hidden />
              Secure backend API — your OPENAI_API_KEY never ships to the browser.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4" aria-label="Platform stats">
            {[
              { k: "20+", v: "Career fields" },
              { k: "60+", v: "Curated courses" },
              { k: "/100", v: "Resume score" },
              { k: "/100", v: "Job match score" },
            ].map((s) => (
              <div key={s.v} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center sm:p-6">
                <p className="text-2xl font-extrabold text-white sm:text-3xl">{s.k}</p>
                <p className="mt-1 text-xs text-slate-400 sm:text-sm">{s.v}</p>
              </div>
            ))}
            <div className="col-span-2 flex items-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-100">
              <Zap className="h-4 w-4 shrink-0" aria-hidden />
              Real AI via server routes: /api/chat, /api/analyze-resume, /api/match-job, /api/roadmap.
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mt-10" aria-labelledby="features">
        <SectionTitle
          eyebrow="Platform"
          title="Everything you need to get hired"
          sub="Responsive dashboard cards. Pick a workflow to begin."
        />
        <div id="features" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Link key={f.href} href={f.href} aria-label={f.title}>
              <Card className="h-full">
                <f.icon className="h-8 w-8 text-cyan-300" aria-hidden />
                <h3 className="mt-3 font-semibold text-white">{f.title}</h3>
                <p className="mt-1 text-sm text-slate-400">{f.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-cyan-300">
                  Open <ArrowRight className="h-4 w-4" aria-hidden />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* FIELDS */}
      <section className="mt-10" aria-labelledby="fields">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-cyan-300">
              Learning paths
            </p>
            <h2 id="fields" className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              20+ career fields, one roadmap
            </h2>
          </div>
          <Link href="/courses" className="text-sm font-medium text-cyan-300 hover:underline">
            Browse all courses →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {CAREER_FIELDS.slice(0, 6).map((f) => (
            <Card key={f.slug}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">{f.name}</h3>
                <Chip>{f.demand}</Chip>
              </div>
              <p className="mt-1 text-sm text-slate-400">{f.tagline}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {f.skills.slice(0, 4).map((s) => (
                  <Chip key={s}>{s}</Chip>
                ))}
              </div>
              <Link
                href={`/courses?field=${f.slug}`}
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-cyan-300 hover:underline"
              >
                View path <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mt-10" aria-labelledby="how">
        <Card>
          <h2 id="how" className="flex items-center gap-2 font-semibold text-white">
            <GraduationCap className="h-5 w-5 text-cyan-300" aria-hidden />
            How the AI works (no mocks)
          </h2>
          <ol className="mt-3 grid gap-3 text-sm text-slate-300 sm:grid-cols-4">
            {[
              "1. You upload a resume or paste a job description.",
              "2. Server parses PDF/DOCX securely (pdf-parse + mammoth).",
              "3. Server calls OpenAI with your OPENAI_API_KEY env var.",
              "4. You get scores, gaps, courses, projects and roadmaps.",
            ].map((s) => (
              <li key={s} className="rounded-xl border border-white/10 bg-white/5 p-3">{s}</li>
            ))}
          </ol>
          <p className="mt-3 text-xs text-slate-500">
            If the key is missing, APIs return a clear 503 error telling you how to configure it —
            never fake scores.
          </p>
        </Card>
      </section>
    </div>
  );
}
