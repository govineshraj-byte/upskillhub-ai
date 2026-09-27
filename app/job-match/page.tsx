"use client";

import { useState } from "react";
import { Loader2, Upload, ClipboardPaste } from "lucide-react";
import { Card, SectionTitle, ScoreRing, Chip } from "@/components/ui";

type Match = {
  matchScore: number;
  verdict: string;
  matchingSkills: string[];
  missingSkills: string[];
  missingKeywords: string[];
  recommendedCourses: string[];
  recommendedProjects: string[];
  resumeImprovements: string[];
};

export default function JobMatchPage() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jd, setJd] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Match | null>(null);

  async function loadResumeFile(f: File | undefined) {
    if (!f) return;
    if (f.name.toLowerCase().endsWith(".txt")) {
      setResumeText((await f.text()).slice(0, 20000));
      return;
    }
    // For PDF/DOCX, send through the analyzer API to extract text, then reuse here.
    const fd = new FormData();
    fd.append("resume", f);
    const res = await fetch("/api/analyze-resume", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Could not read resume file.");
    setError("Resume parsed. Paste/keep the extracted summary below — or paste full resume text for best matching.");
    setResumeText(
      `Skills: ${(data.skills || []).join(", ")}\nExperience: ${data.experience || ""}\nProjects: ${data.projects || ""}\nSummary: ${data.summary || ""}`
    );
  }

  async function match() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/match-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, role, jobDescription: jd, resumeText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Matching failed.");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Matching failed.");
    } finally {
      setLoading(false);
    }
  }

  const valid = role.trim().length >= 2 && jd.trim().length >= 50 && resumeText.trim().length >= 50;

  return (
    <div className="py-8">
      <SectionTitle
        eyebrow="Job matching"
        title="Company / Job Match"
        sub="Enter company + role + live job description. We compare YOUR resume text against that JD — nothing hardcoded."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="company" className="text-sm font-medium text-slate-200">Company (optional)</label>
                <input id="company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Infosys" className="mt-1 min-h-[44px] w-full rounded-xl border border-white/15 bg-black/40 px-3 text-sm text-white" />
              </div>
              <div>
                <label htmlFor="role" className="text-sm font-medium text-slate-200">Job role *</label>
                <input id="role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Frontend Developer" className="mt-1 min-h-[44px] w-full rounded-xl border border-white/15 bg-black/40 px-3 text-sm text-white" />
              </div>
            </div>
            <div>
              <label htmlFor="jd" className="flex items-center gap-1.5 text-sm font-medium text-slate-200"><ClipboardPaste className="h-4 w-4" aria-hidden /> Job description * (paste current posting)</label>
              <textarea id="jd" value={jd} onChange={(e) => setJd(e.target.value)} rows={8} placeholder="Paste the full JD: responsibilities, required skills, qualifications…" className="mt-1 w-full rounded-xl border border-white/15 bg-black/40 p-3 text-sm text-white" />
              <p className="mt-1 text-xs text-slate-500">{jd.length} chars (min 50)</p>
            </div>
            <div>
              <label htmlFor="resumeText" className="text-sm font-medium text-slate-200">Your resume text *</label>
              <textarea id="resumeText" value={resumeText} onChange={(e) => setResumeText(e.target.value)} rows={8} placeholder="Paste resume text, or upload below to auto-fill…" className="mt-1 w-full rounded-xl border border-white/15 bg-black/40 p-3 text-sm text-white" />
              <div className="mt-2 flex items-center gap-2">
                <Upload className="h-4 w-4 text-cyan-300" aria-hidden />
                <input type="file" accept=".pdf,.doc,.docx,.txt" aria-label="Upload resume to auto-fill text" onChange={(e) => loadResumeFile(e.target.files?.[0]).catch((err) => setError(err.message))} className="text-xs text-slate-300 file:mr-2 file:rounded-lg file:border-0 file:bg-cyan-500 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-950" />
              </div>
            </div>
            <button onClick={match} disabled={!valid || loading} className="btn-glow flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">
              {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              {loading ? "Matching…" : "Compare Resume vs Job"}
            </button>
            {error && <div role="alert" className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}
          </div>
        </Card>

        <div className="space-y-4">
          {!result && <Card><p className="py-10 text-center text-sm text-slate-400">Match Score /100, missing skills, keywords, courses, projects and fixes will appear here.</p></Card>}
          {result && (
            <>
              <Card>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-white">{role}{company ? ` @ ${company}` : ""}</h2>
                    <p className="mt-1 text-sm text-slate-300">{result.verdict}</p>
                  </div>
                  <ScoreRing score={result.matchScore} />
                </div>
              </Card>
              <Card>
                <h3 className="font-semibold text-emerald-300">Matching skills</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">{result.matchingSkills.map((s) => <Chip key={s}>{s}</Chip>)}</div>
                <h3 className="mt-4 font-semibold text-amber-300">Missing skills</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">{result.missingSkills.map((s) => <Chip key={s}>{s}</Chip>)}</div>
                <h3 className="mt-4 font-semibold text-white">Missing keywords</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">{result.missingKeywords.map((s) => <Chip key={s}>{s}</Chip>)}</div>
              </Card>
              <Card>
                <h3 className="font-semibold text-white">Recommended courses</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">{result.recommendedCourses.map((s, i) => <li key={i}>{s}</li>)}</ul>
                <h3 className="mt-4 font-semibold text-white">Recommended projects</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">{result.recommendedProjects.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </Card>
              <Card>
                <h3 className="font-semibold text-white">Resume improvements for THIS job</h3>
                <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-slate-300">{result.resumeImprovements.map((s, i) => <li key={i}>{s}</li>)}</ol>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
