import { NextResponse } from "next/server";
import { z } from "zod";
import { chatComplete, hasOpenAIKey, safeJsonParse } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const Schema = z.object({
  currentStage: z.string().min(1).max(300),
  targetCareer: z.string().min(1).max(300),
  skills: z.string().min(1).max(2000).default(""),
  timeline: z.string().min(1).max(100).default("6 months"),
  hoursPerWeek: z.string().min(1).max(50).default("8-10 hours"),
});

export async function POST(req: Request) {
  const parsed = Schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  if (!hasOpenAIKey())
    return NextResponse.json(
      { error: "AI is not configured. Set OPENAI_API_KEY to generate roadmaps." },
      { status: 503 }
    );
  try {
    const { currentStage, targetCareer, skills, timeline, hoursPerWeek } = parsed.data;
    const prompt = `Build a personalized career roadmap. Return ONLY valid JSON:
{
  "headline": "<motivating 1-line plan title>",
  "overview": "<3-4 sentences>",
  "phases": [
    { "title": "...", "weeks": "...", "goals": ["..."], "skills": ["..."], "courses": ["... with provider"], "projects": ["..."], "certifications": ["..."] }
  ],
  "resumePlan": ["..."],
  "interviewPlan": ["..."],
  "jobPlan": ["..."],
  "weeklySchedule": "<concrete plan for ${hoursPerWeek}/week>",
  "successMetrics": ["..."]
}
Cover exactly: Career → Skills → Courses → Projects → Certifications → Resume → Interview → Job.
User: current=${currentStage}, target=${targetCareer}, skills=${skills}, timeline=${timeline}, availability=${hoursPerWeek}.`;
    const raw = await chatComplete(
      [{ role: "system", content: "You are a career roadmap planner. Return valid JSON only." }, { role: "user", content: prompt }],
      { maxTokens: 2600, json: true }
    );
    return NextResponse.json(safeJsonParse(raw, { headline: "", overview: raw.slice(0, 500), phases: [] }));
  } catch (e) {
    console.error("roadmap error:", e);
    return NextResponse.json({ error: e instanceof Error ? e.message : "Roadmap failed." }, { status: 500 });
  }
}
