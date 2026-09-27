import { NextResponse } from "next/server";
import { z } from "zod";
import { chatComplete, hasOpenAIKey } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Schema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string().min(1).max(8000),
      })
    )
    .min(1)
    .max(30),
  mode: z
    .enum([
      "general",
      "career-guidance",
      "courses",
      "skill-gap",
      "resume",
      "interview",
      "roadmap",
    ])
    .optional()
    .default("general"),
});

const SYSTEM_BY_MODE: Record<string, string> = {
  general:
    "You are UpskillHub AI, a concise expert career mentor. Give practical, structured answers with headers and bullet points. End with 2-3 next steps.",
  "career-guidance":
    "You are an expert career counselor. Ask clarifying questions when needed, compare career options with demand/salary/skills, and recommend a concrete 90-day plan.",
  courses:
    "You are a course recommender. Recommend real courses with provider + level + why it fits. Prefer well-known providers (Coursera, Udemy, edX, Udacity, official docs). Tailor to the user's level and goal.",
  "skill-gap":
    "You are a skill-gap analyst. Given current skills and target role, list Have vs Missing skills, rate readiness /100, and give a prioritized learning plan.",
  resume:
    "You are a resume coach. Give specific, line-level improvements: stronger bullets (action verb + metric), keywords, formatting, ATS tips.",
  interview:
    "You are an interview coach. Ask the target role, then drill with realistic questions, model answers (STAR), and feedback. Include coding/behavioral/system-design as relevant.",
  roadmap:
    "You are a roadmap generator. Output Career → Skills → Courses → Projects → Certifications → Resume → Interview → Job with week-by-week milestones for the user's goal and timeline.",
};

export async function POST(req: Request) {
  const parsed = Schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }
  if (!hasOpenAIKey()) {
    return NextResponse.json(
      {
        error:
          "AI is not configured. Set OPENAI_API_KEY (and optionally OPENAI_MODEL, OPENAI_BASE_URL) in your environment / Vercel dashboard, then redeploy.",
      },
      { status: 503 }
    );
  }
  try {
    const { messages, mode } = parsed.data;
    const reply = await chatComplete(
      [{ role: "system", content: SYSTEM_BY_MODE[mode] }, ...messages],
      { maxTokens: 2200 }
    );
    return NextResponse.json({ reply, mode });
  } catch (e) {
    console.error("chat error:", e);
    const msg = e instanceof Error ? e.message : "AI request failed.";
    const status = msg.includes("not configured") ? 503 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
