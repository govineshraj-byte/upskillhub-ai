# UpskillHub AI v2 — AI Career Guidance + Resume Analyzer + Learning Platform

Premium navy theme. Real AI backend (no mocks). Deploy-ready zip for Vercel.

## Features
- **Dashboard** (`/`): navy premium hero, stats, 4 workflow cards, 20+ career fields preview.
- **AI Assistant** (`/assistant`): 7 modes — general, career guidance, courses, skill-gap, resume, interview, roadmap. POST `/api/chat`.
- **Resume Analyzer** (`/resume-analyzer`): upload PDF/DOCX → server parses (pdf-parse + mammoth) → AI returns score /100, skills, education, experience, projects, certs, keywords, strengths, weaknesses, improvements, missing skills, courses. POST `/api/analyze-resume`.
- **Job Match** (`/job-match`): company + role + live JD + resume text → match score /100, matching/missing skills, missing keywords, courses, projects, fixes. POST `/api/match-job`. Nothing hardcoded.
- **Roadmap** (`/roadmap`): Career → Skills → Courses → Projects → Certifications → Resume → Interview → Job. POST `/api/roadmap`.
- **Courses** (`/courses`): 22 career fields with skills, 100% free course links, projects, certifications. Search + filter + deep links (`/courses?field=python`).

## Environment (required for AI)
Copy `.env.example` → `.env.local` locally, or set in Vercel dashboard.

**Free path (Gemini, recommended):** get a key at aistudio.google.com, then set:
```
OPENAI_API_KEY=<your Gemini key>
OPENAI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai
OPENAI_MODEL=gemini-3.8-flash   # or whatever current Flash model AI Studio lists
```

**Paid path (OpenAI):**
```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
# OPENAI_BASE_URL defaults to https://api.openai.com/v1
```

Without the key, APIs return HTTP 503 with a clear message (never fake scores). Works with any OpenAI-compatible endpoint (OpenAI, Azure OpenAI, OpenRouter via BASE_URL + MODEL).

## Run locally
```bash
npm install
npm run dev
# open http://localhost:3000
```

## Verify
```bash
npm run typecheck
npm run build
```

## Deploy to Vercel (2 minutes)
1. Push this folder to GitHub **or** drag-drop the zip at vercel.com/new.
2. Framework preset: **Next.js**. Build command: `npm run build`. Output: `.next`.
3. Add Environment Variable: `OPENAI_API_KEY` (Production + Preview + Development).
4. Deploy. Test: `/assistant`, `/resume-analyzer`, `/job-match`, `/roadmap`, `/courses`.

## Notes
- Key stays server-side (`lib/ai.ts` + `app/api/*`). Never imported by client components.
- Resume files: 10MB cap, PDF/DOCX/TXT. Scanned-image PDFs return a 422 hint.
- Stack: Next.js 14 App Router, React 18, Tailwind v4, lucide-react, motion-ready, zod.
