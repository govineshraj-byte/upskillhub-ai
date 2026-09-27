import { NextResponse } from "next/server";
import { chatComplete, hasOpenAIKey, safeJsonParse } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_FILE_MB = 10;

async function extractText(file: File): Promise<string> {
  const buf = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  if (name.endsWith(".pdf") || type.includes("pdf")) {
    // pdf-parse ships a debug entry that breaks bundlers; import the lib file directly.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require("pdf-parse/lib/pdf-parse.js") as (
      b: Buffer
    ) => Promise<{ text: string }>;
    const out = await pdfParse(buf);
    return (out.text || "").slice(0, 20000);
  }
  if (name.endsWith(".docx") || type.includes("word") || name.endsWith(".doc")) {
    const mammoth = await import("mammoth");
    const out = await mammoth.extractRawText({ buffer: buf });
    return (out.value || "").slice(0, 20000);
  }
  // plain text fallback
  return buf.toString("utf-8").slice(0, 20000);
}

export async function POST(req: Request) {
  try {
    const form = await req.formData().catch(() => null);
    if (!form) return NextResponse.json({ error: "Send multipart form with 'resume' file." }, { status: 400 });
    const file = form.get("resume");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No resume file found. Upload a PDF or DOCX." }, { status: 400 });
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      return NextResponse.json({ error: `File too large. Max ${MAX_FILE_MB}MB.` }, { status: 400 });
    }
    const text = await extractText(file);
    if (!text || text.trim().length < 100) {
      return NextResponse.json(
        { error: "Could not extract readable text. Upload a text-based PDF/DOCX (not a scanned image)." },
        { status: 422 }
      );
    }
    if (!hasOpenAIKey()) {
      return NextResponse.json(
        {
          error:
            "AI is not configured. Set OPENAI_API_KEY in your environment / Vercel dashboard to enable resume analysis.",
          extractedChars: text.length,
        },
        { status: 503 }
      );
    }

    const prompt = `Analyze this resume and return ONLY valid JSON (no markdown fences) with this exact shape:
{
  "score": <0-100 integer>,
  "summary": "<2-3 sentence overall assessment>",
  "skills": ["..."],
  "education": "<brief>",
  "experience": "<brief>",
  "projects": "<brief>",
  "certifications": ["..."],
  "keywords": ["..."],
  "strengths": ["... 3-6 items"],
  "weaknesses": ["... 3-6 items"],
  "improvements": ["... 5-8 specific actionable fixes"],
  "missingSkills": ["... skills to learn for modern roles"],
  "recommendedCourses": ["... 4-6 named courses with provider"]
}
Be strict: score = weighted blend of impact bullets, quantified results, skills relevance, formatting/ATS, projects, education. Deduct for vagueness, no metrics, typos signals, missing contact info.

RESUME TEXT:
"""${text.slice(0, 12000)}"""`;

    const raw = await chatComplete(
      [
        { role: "system", content: "You are a strict ATS + hiring-manager resume analyst. Always return valid JSON only." },
        { role: "user", content: prompt },
      ],
      { maxTokens: 2200, json: true }
    );

    const fallback = {
      score: 0,
      summary: "Analysis failed to parse.",
      skills: [],
      education: "",
      experience: "",
      projects: "",
      certifications: [],
      keywords: [],
      strengths: [],
      weaknesses: [],
      improvements: [],
      missingSkills: [],
      recommendedCourses: [],
    };
    const data = safeJsonParse(raw, fallback);
    return NextResponse.json({ ...data, extractedChars: text.length, fileName: file.name });
  } catch (e) {
    console.error("analyze-resume error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Resume analysis failed." },
      { status: 500 }
    );
  }
}
