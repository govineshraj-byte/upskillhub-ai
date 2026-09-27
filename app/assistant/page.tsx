"use client";

import { useRef, useState } from "react";
import { Bot, Send, Loader2, User, RotateCcw } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const MODES = [
  { id: "general", label: "General" },
  { id: "career-guidance", label: "Career guidance" },
  { id: "courses", label: "Courses" },
  { id: "skill-gap", label: "Skill-gap" },
  { id: "resume", label: "Resume" },
  { id: "interview", label: "Interview" },
  { id: "roadmap", label: "Roadmap" },
] as const;

const STARTERS = [
  "I know Python basics. Should I pick Data Analytics or Backend? Compare and give a 90-day plan.",
  "Analyze my skill gap: I know HTML/CSS/JS, want a React frontend job. What's missing?",
  "Recommend 3 real courses for Generative AI with providers and why each fits.",
  "Mock interview me for a Python backend intern role. Ask one question at a time.",
];

export default function AssistantPage() {
  const [mode, setMode] = useState<(typeof MODES)[number]["id"]>("general");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setError("");
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, mode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "AI request failed.");
      setMessages([...next, { role: "assistant", content: data.reply }]);
      requestAnimationFrame(() =>
        boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" })
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-8">
      <SectionTitle
        eyebrow="AI Mentor"
        title="Working AI assistant"
        sub="Career guidance, courses, skill-gap, resume, interview prep and roadmaps — powered by /api/chat."
      />
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Card className="h-fit">
          <h2 className="text-sm font-semibold text-white">Assistant mode</h2>
          <div className="mt-3 flex flex-wrap gap-2 lg:flex-col" role="radiogroup" aria-label="Assistant mode">
            {MODES.map((m) => (
              <button
                key={m.id}
                role="radio"
                aria-checked={mode === m.id}
                onClick={() => setMode(m.id)}
                className={cn(
                  "rounded-xl border px-3 py-2 text-left text-sm font-medium transition-colors",
                  mode === m.id
                    ? "border-cyan-400/50 bg-cyan-400/15 text-cyan-200"
                    : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
          <div className="mt-4 border-t border-white/10 pt-4">
            <h3 className="text-sm font-semibold text-white">Try one</h3>
            <ul className="mt-2 space-y-2">
              {STARTERS.map((s) => (
                <li key={s}>
                  <button
                    onClick={() => send(s)}
                    className="w-full rounded-lg bg-white/5 p-2 text-left text-xs text-slate-300 hover:bg-white/10 hover:text-white"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card className="flex min-h-[540px] flex-col">
          <div className="mb-3 flex items-center justify-between">
            <p className="flex items-center gap-2 text-sm font-semibold text-white">
              <Bot className="h-5 w-5 text-cyan-300" aria-hidden /> UpskillHub AI · {mode}
            </p>
            <button
              onClick={() => { setMessages([]); setError(""); }}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Reset
            </button>
          </div>

          <div ref={boxRef} className="custom-scroll max-h-[52vh] min-h-[320px] flex-1 space-y-3 overflow-y-auto rounded-xl border border-white/10 bg-black/30 p-4" aria-live="polite">
            {messages.length === 0 && (
              <div className="py-10 text-center text-sm text-slate-400">
                <Bot className="mx-auto mb-3 h-10 w-10 text-cyan-300/70" aria-hidden />
                Ask anything about careers, skills, courses, resumes or interviews.
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={cn("flex gap-2", m.role === "user" ? "justify-end" : "justify-start")}>
                {m.role === "assistant" && <Bot className="mt-1 h-5 w-5 shrink-0 text-cyan-300" aria-hidden />}
                <div
                  className={cn(
                    "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                    m.role === "user" ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white" : "border border-white/10 bg-white/5 text-slate-200"
                  )}
                >
                  {m.content}
                </div>
                {m.role === "user" && <User className="mt-1 h-5 w-5 shrink-0 text-slate-400" aria-hidden />}
              </div>
            ))}
            {loading && (
              <p className="flex items-center gap-2 text-sm text-cyan-200">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Thinking…
              </p>
            )}
          </div>

          {error && (
            <div role="alert" className="mt-3 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => { e.preventDefault(); send(); }}
          >
            <label htmlFor="chat-input" className="sr-only">Ask the AI mentor</label>
            <input
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. Give me a 6-month roadmap to become a data analyst…"
              className="min-h-[44px] flex-1 rounded-xl border border-white/15 bg-black/40 px-4 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn-glow inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 text-sm font-semibold text-white disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
              Send
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
