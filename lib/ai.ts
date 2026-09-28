export const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
export const OPENAI_BASE_URL =
  process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";

export function hasOpenAIKey() {
  return Boolean(process.env.OPENAI_API_KEY);
}

type ChatMsg = { role: "system" | "user" | "assistant"; content: string };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function friendlyError(status: number, raw: string): string {
  const lower = raw.toLowerCase();
  if (status === 401 || status === 403 || lower.includes("invalid api key") || lower.includes("incorrect api key")) {
    return "Invalid API key. Check OPENAI_API_KEY in your Vercel environment variables.";
  }
  if (status === 402 || lower.includes("insufficient_quota") || lower.includes("no credits")) {
    return "The AI account has no credits left. Add billing/credits to the provider account, or switch to a free-tier key.";
  }
  if (status === 404 || lower.includes("no longer available") || lower.includes("model_not_found") || lower.includes("not_found")) {
    return "The configured AI model is not available. Update OPENAI_MODEL to a current model ID, then redeploy.";
  }
  if (status === 429 || (status === 503 && lower.includes("high demand"))) {
    return "The AI provider is overloaded right now (free-tier spike). Please try again in a few seconds.";
  }
  if (status === 503) {
    return "The AI provider is temporarily unavailable. Please try again shortly.";
  }
  return `AI provider error (${status}). Please try again.`;
}

export async function chatComplete(
  messages: ChatMsg[],
  opts: { maxTokens?: number; temperature?: number; json?: boolean } = {}
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured on the server.");
  const base = OPENAI_BASE_URL.replace(/\/+$/, "");

  let lastError = "";
  for (let attempt = 1; attempt <= 3; attempt++) {
    let res: Response;
    try {
      res = await fetch(`${base}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: OPENAI_MODEL,
          messages,
          temperature: opts.temperature ?? 0.6,
          max_tokens: opts.maxTokens ?? 2000,
          ...(opts.json ? { response_format: { type: "json_object" } } : {}),
        }),
      });
    } catch (e) {
      lastError = "Could not reach the AI provider (network error). Please try again.";
      await sleep(1000 * attempt);
      continue;
    }

    if (res.ok) {
      const data = await res.json().catch(() => null);
      const content: string | undefined = data?.choices?.[0]?.message?.content;
      if (!content) throw new Error("AI provider returned an empty response.");
      return content;
    }

    const text = await res.text().catch(() => "");
    lastError = friendlyError(res.status, text);

    // Retry transient overload/rate-limit/server errors with backoff; fail fast otherwise.
    const retryable = res.status === 429 || res.status >= 500;
    if (retryable && attempt < 3) {
      await sleep(1500 * attempt);
      continue;
    }
    throw new Error(lastError);
  }
  throw new Error(lastError || "AI request failed after retries.");
}

export function safeJsonParse<T>(text: string, fallback: T): T {
  const tryParse = (s: string): T | null => {
    try {
      return JSON.parse(s) as T;
    } catch {
      return null;
    }
  };
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  const direct = tryParse(cleaned);
  if (direct !== null) return direct;
  // Fallback: extract the largest {...} block (models sometimes add prose around JSON).
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    const extracted = tryParse(cleaned.slice(start, end + 1));
    if (extracted !== null) return extracted;
  }
  return fallback;
}
