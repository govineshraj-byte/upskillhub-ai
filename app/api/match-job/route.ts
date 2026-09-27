import { NextResponse } from "next/server";
import { z } from "zod";
import { chatComplete, hasOpenAIKey, safeJsonParse } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const Schema = z.object({
  resumeText: z.string().min(50).max(20000),
  company: z.string().min(1).max(200).optional().default(""),
  role: z.string().min(1).max(200),
  jobDescription: z.string().min(50).max(20000),
});

export async function POST(req: Request) {
  const parsed = Schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Provide role, jobDescription (50+ chars) and resumeText (50+ chars)." },
      { status: 400 }
    );
  }
  if (!hasOpenAIKey()) {
    return NextResponse.json(
      { error: "AI is not configured. Set OPENAI_API_KEY to enable job matching." },
      { status: 503 }
    );
  }
  try {
    const { resumeText, company, role, jobDescription } = parsed.data;
    const prompt = `Compare the RESUME against the JOB DESCRIPTION for role "${role}"${company ? ` at "${company}"` : ""}.
Use ONLY the provided job description (do not invent requirements). Return ONLY valid JSON:
{
  "matchScore": <0-100>,
  "verdict": "<1 sentence: strong fit / partial fit / weak fit>",
  "matchingSkills": ["..."],
  "missingSkills": ["..."],
  "missingKeywords": ["..."],
  "recommendedCourses": ["... 4-6 named courses with provider"],
  "recommendedProjects": ["... 3-5 buildable projects closing the gap"],
  "resumeImprovements": ["... 5-8 tailored bullet/keyword fixes for THIS job"]
}
Score strictly: required skills coverage, keyword overlap, seniority alignment, domain experience, projects proof.

JOB DESCRIPTION:
"""${jobDescription.slice(0, 10000)}"""

RESUME:
"""${resumeText.slice(0, 10000)}"""`;
    const raw = await chatComplete(
      [
        { role: "system", content: "You are a hiring-matching engine. Return valid JSON only." },
        { role: "user", content: prompt },
      ],
      { maxTokens: 2200, json: true }
    );
    const data = safeJsonParse(
      raw,
      { matchScore: 0, verdict: "Parse failed", matchingSkills: [], missingSkills: [], missingKeywords: [], recommendedCourses: [], recommendedProjects: [], resumeImprovements: [] }
    );
    return NextResponse.json(data);
  } catch (e) {
    console.error("match-job error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Job matching failed." },
      { status: 500 }
    );
  }
}
