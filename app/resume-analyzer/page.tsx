"use client";

import { useState } from "react";
import { Upload, Loader2, FileText, CheckCircle2, AlertTriangle } from "lucide-react";
import { Card, SectionTitle, ScoreRing, Chip } from "@/components/ui";

type Result = {
  score: number;
  summary: string;
  skills: string[];
  education: string;
  experience: string;
  projects: string;
  certifications: string[];
  keywords: string[];
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  missingSkills: string[];
  recommendedCourses: string[];
  fileName?: string;
};

export default function ResumeAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  async function analyze() {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("resume", file);
      const res = await fetch("/api/analyze-resume", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Analysis failed.");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-8">
      <SectionTitle
        eyebrow="Resume AI"
        title="AI Resume Analyzer"
        sub="Upload a PDF/DOCX resume. Get Resume Score /100, skills, strengths, weaknesses and exact fixes."
      />
      <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
        <Card>
          <label htmlFor="resume-file" className="text-sm font-semibold text-white">
            Upload resume (PDF / DOCX, max 10MB)
          </label>
          <div className="mt-3 rounded-2xl border-2 border-dashed border-cyan-400/30 bg-black/30 p-6 text-center">
            <Upload className="mx-auto h-8 w-8 text-cyan-300" aria-hidden />
            <input
              id="resume-file"
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="mt-3 w-full text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-cyan-500 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-950"
            />
            {file && (
              <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-slate-300">
                <FileText className="h-3.5 w-3.5" aria-hidden /> {file.name} · {(file.size / 1024).toFixed(0)} KB
              </p>
            )}
          </div>
          <button
            onClick={analyze}
            disabled={!file || loading}
            className="btn-glow mt-4 flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            {loading ? "Analyzing with AI…" : "Analyze Resume"}
          </button>
          {error && (
            <div role="alert" className="mt-3 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          )}
          <ul className="mt-4 space-y-1.5 text-xs text-slate-400">
            <li>• Real parsing: pdf-parse + mammoth on the server.</li>
            <li>• Real AI scoring via OPENAI_API_KEY — never mocked.</li>
            <li>• Tip: text-based PDFs work best (not scanned images).</li>
          </ul>
        </Card>

        <div className="space-y-4">
          {!result && !loading && (
            <Card>
              <p className="py-10 text-center text-sm text-slate-400">
                Your analysis will appear here with score, skills, gaps and course picks.
              </p>
            </Card>
          )}
          {loading && (
            <Card>
              <div className="space-y-3" aria-label="Analyzing">
                <div className="h-6 w-1/3 animate-pulse rounded bg-white/10" />
                <div className="h-24 animate-pulse rounded-xl bg-white/10" />
                <div className="h-24 animate-pulse rounded-xl bg-white/10" />
              </div>
            </Card>
          )}
          {result && (
            <>
              <Card>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-white">Resume Report</h2>
                    <p className="mt-1 max-w-xl text-sm text-slate-300">{result.summary}</p>
                  </div>
                  <ScoreRing score={result.score} />
                </div>
                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div className="rounded-xl bg-white/5 p-3"><p className="font-semibold text-white">Education</p><p className="mt-1 text-slate-300">{result.education || "—"}</p></div>
                  <div className="rounded-xl bg-white/5 p-3"><p className="font-semibold text-white">Experience</p><p className="mt-1 text-slate-300">{result.experience || "—"}</p></div>
                </div>
                <div className="mt-3 rounded-xl bg-white/5 p-3 text-sm"><p className="font-semibold text-white">Projects</p><p className="mt-1 text-slate-300">{result.projects || "—"}</p></div>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <h3 className="flex items-center gap-2 font-semibold text-white"><CheckCircle2 className="h-4 w-4 text-emerald-300" aria-hidden /> Strengths</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">{result.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
                  <h3 className="mt-4 font-semibold text-white">Skills found</h3>
                  <div className="mt-2 flex flex-wrap gap-1.5">{result.skills.map((s) => <Chip key={s}>{s}</Chip>)}</div>
                  <h3 className="mt-4 font-semibold text-white">Keywords</h3>
                  <div className="mt-2 flex flex-wrap gap-1.5">{result.keywords.map((s) => <Chip key={s}>{s}</Chip>)}</div>
                </Card>
                <Card>
                  <h3 className="flex items-center gap-2 font-semibold text-white"><AlertTriangle className="h-4 w-4 text-amber-300" aria-hidden /> Weaknesses</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">{result.weaknesses.map((s, i) => <li key={i}>{s}</li>)}</ul>
                  <h3 className="mt-4 font-semibold text-white">Missing skills to learn</h3>
                  <div className="mt-2 flex flex-wrap gap-1.5">{result.missingSkills.map((s) => <Chip key={s}>{s}</Chip>)}</div>
                </Card>
              </div>

              <Card>
                <h3 className="font-semibold text-white">Specific improvements</h3>
                <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-slate-300">{result.improvements.map((s, i) => <li key={i}>{s}</li>)}</ol>
              </Card>
              <Card>
                <h3 className="font-semibold text-white">Recommended courses</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">{result.recommendedCourses.map((s, i) => <li key={i}>{s}</li>)}</ul>
                {result.certifications.length > 0 && (
                  <>
                    <h3 className="mt-4 font-semibold text-white">Certifications spotted / suggested</h3>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">{result.certifications.map((s, i) => <li key={i}>{s}</li>)}</ul>
                  </>
                )}
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
