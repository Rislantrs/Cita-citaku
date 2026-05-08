import { GoogleGenAI } from '@google/genai';

// Types for AI Request
export type AITaskType = 'counselor' | 'quiz' | 'assistant' | 'logic' | 'gemma';

interface AIResponse {
  text: string;
  modelUsed: string;
  reasoning?: any;
}

const SYSTEM_PROMPTS: Record<AITaskType, string> = {
  counselor: "Kamu adalah AI Counselor Cita-citaku. Fokus: Karier, Pendidikan, Roadmap. Gaya: Inspiratif & Ramah.",
  assistant: "Kamu adalah Project Assistant. Bantu teknis pengerjaan proyek. Gaya: Praktis & Solutif.",
  quiz: "Kamu adalah Quiz Generator. Buat soal pilihan ganda dari teks materi dalam format JSON.",
  logic: "Kamu adalah Expert Logika. Selesaikan masalah sulit langkah demi langkah.",
  gemma: "Kamu adalah Google Gemma. Berikan jawaban yang ringkas dan akurat."
};

const GROQ_MODELS: Record<AITaskType, string> = {
  counselor: "llama-3.3-70b-versatile",
  assistant: "llama-3.1-8b-instant",
  quiz: "llama-3.3-70b-versatile",
  logic: "llama-3.3-70b-versatile",
  gemma: "llama-3.1-8b-instant"
};

const OPENROUTER_MODELS: Record<AITaskType, string> = {
  counselor: "google/gemini-flash-1.5-exp:free",
  assistant: "meta-llama/llama-3.3-70b-instruct:free",
  quiz: "tencent/hy3-preview:free",
  logic: "nvidia/nemotron-3-super-120b-a12b:free",
  gemma: "google/gemma-2-9b-it:free"
};

function buildMessages(task: AITaskType, userPrompt: string, history: any[]) {
  return [
    { role: "system", content: SYSTEM_PROMPTS[task] },
    ...history,
    { role: "user", content: userPrompt }
  ];
}

// ─── NON-STREAMING (Legacy, tetap dipertahankan) ───────────────────────────
export async function callAI(task: AITaskType, userPrompt: string, history: any[] = []): Promise<AIResponse> {
  const groqKey = process.env.GROQ_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  // 1. Groq
  if (groqKey) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${groqKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: GROQ_MODELS[task] || "llama-3.1-8b-instant",
          messages: buildMessages(task, userPrompt, history),
          temperature: 0.7
        })
      });
      const data = await response.json();
      if (!data.error) {
        return { text: data.choices[0].message.content, modelUsed: `Groq:${data.model}` };
      }
      console.warn("Groq failed, trying OpenRouter...");
    } catch (e) { console.error("Groq Error:", e); }
  }

  // 2. OpenRouter
  if (openRouterKey) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${openRouterKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: OPENROUTER_MODELS[task] || "openrouter/auto-free",
          messages: buildMessages(task, userPrompt, history),
          include_reasoning: true
        })
      });
      const data = await response.json();
      if (!data.error) {
        return {
          text: data.choices[0].message.content,
          modelUsed: `OpenRouter:${data.model}`,
          reasoning: data.choices[0].message.reasoning_details
        };
      }
    } catch (e) { console.error("OpenRouter Error:", e); }
  }

  // 3. Google AI Studio
  if (geminiKey) {
    return callGoogleDirect(task, userPrompt, history);
  }

  throw new Error("No AI API Keys available");
}

// ─── STREAMING (SSE — kata demi kata) ──────────────────────────────────────
export async function streamAI(
  task: AITaskType,
  userPrompt: string,
  history: any[],
  onChunk: (chunk: string) => void,
  onDone: (fullText: string, model: string) => void,
  onError: (err: Error) => void
): Promise<void> {
  const groqKey = process.env.GROQ_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  // Helper: stream dari OpenAI-compatible API
  async function streamOpenAI(url: string, apiKey: string, model: string): Promise<boolean> {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: buildMessages(task, userPrompt, history),
          stream: true,
          temperature: 0.7
        })
      });

      if (!response.ok || !response.body) return false;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;
          const payload = trimmed.slice(6);
          if (payload === '[DONE]') continue;

          try {
            const json = JSON.parse(payload);
            const content = json.choices?.[0]?.delta?.content;
            if (content) {
              fullText += content;
              onChunk(content);
            }
          } catch { /* skip malformed JSON */ }
        }
      }

      if (fullText.length > 0) {
        onDone(fullText, model);
        return true;
      }
      return false;
    } catch (e) {
      console.error(`Stream error from ${url}:`, e);
      return false;
    }
  }

  // 1. Coba Groq Streaming
  if (groqKey) {
    const ok = await streamOpenAI(
      "https://api.groq.com/openai/v1/chat/completions",
      groqKey,
      GROQ_MODELS[task] || "llama-3.1-8b-instant"
    );
    if (ok) return;
  }

  // 2. Coba OpenRouter Streaming
  if (openRouterKey) {
    const ok = await streamOpenAI(
      "https://openrouter.ai/api/v1/chat/completions",
      openRouterKey,
      OPENROUTER_MODELS[task] || "openrouter/auto-free"
    );
    if (ok) return;
  }

  // 3. Fallback: Google AI Studio (non-streaming, kirim sekaligus)
  if (geminiKey) {
    try {
      const result = await callGoogleDirect(task, userPrompt, history);
      // Simulasi streaming: kirim per kalimat
      const sentences = result.text.match(/[^.!?]+[.!?]+/g) || [result.text];
      for (const sentence of sentences) {
        onChunk(sentence);
        await new Promise(r => setTimeout(r, 50));
      }
      onDone(result.text, result.modelUsed);
      return;
    } catch (e) {
      onError(e as Error);
      return;
    }
  }

  onError(new Error("No AI API Keys available"));
}

// ─── GOOGLE DIRECT (Fallback) ──────────────────────────────────────────────
async function callGoogleDirect(task: AITaskType, userPrompt: string, history: any[]): Promise<AIResponse> {
  try {
    const genAI: any = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY } as any);
    const modelName = task === 'gemma' ? "gemma-2-27b-it" : "gemini-2.0-flash-exp";
    const model = genAI.models.get(modelName);

    const contents = [
      { role: 'user', parts: [{ text: SYSTEM_PROMPTS[task] }] },
      ...history.map(h => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }]
      })),
      { role: 'user', parts: [{ text: userPrompt }] }
    ];

    const result = await model.generateContent({ contents });
    const response = await result.response;

    return {
      text: response.text(),
      modelUsed: `GoogleAIStudio:${modelName}`
    };
  } catch (error) {
    console.error("All providers failed:", error);
    throw new Error("AI services currently unavailable.");
  }
}
