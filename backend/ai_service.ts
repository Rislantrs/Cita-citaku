import { GoogleGenAI } from '@google/genai';

// Types for AI Request
export type AITaskType = 'counselor' | 'quiz' | 'assistant' | 'logic' | 'gemma';

interface AIResponse {
  text: string;
  modelUsed: string;
  reasoning?: any;
}

const SYSTEM_PROMPTS = {
  counselor: "Kamu adalah AI Counselor Cita-citaku. Fokus: Karier, Pendidikan, Roadmap. Gaya: Inspiratif & Ramah.",
  assistant: "Kamu adalah Project Assistant. Bantu teknis pengerjaan proyek. Gaya: Praktis & Solutif.",
  quiz: "Kamu adalah Quiz Generator. Buat soal pilihan ganda dari teks materi dalam format JSON.",
  logic: "Kamu adalah Expert Logika. Selesaikan masalah sulit langkah demi langkah.",
  gemma: "Kamu adalah Google Gemma. Berikan jawaban yang ringkas dan akurat."
};

export async function callAI(task: AITaskType, userPrompt: string, history: any[] = []): Promise<AIResponse> {
  const groqKey = process.env.GROQ_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  // 1. Coba GROQ Dulu (Paling Cepat!)
  if (groqKey) {
    try {
      const groqModels = {
        counselor: "llama-3.3-70b-versatile",
        assistant: "llama-3.1-8b-instant",
        quiz: "llama-3.3-70b-versatile",
        logic: "llama-3.3-70b-versatile",
        gemma: "llama-3.1-8b-instant"
      };

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": groqModels[task] || "llama-3.1-8b-instant",
          "messages": [
            { "role": "system", "content": SYSTEM_PROMPTS[task] },
            ...history,
            { "role": "user", "content": userPrompt }
          ],
          "temperature": 0.7
        })
      });

      const data = await response.json();
      if (!data.error) {
        return {
          text: data.choices[0].message.content,
          modelUsed: `Groq:${data.model}`
        };
      }
      console.warn("Groq failed, trying OpenRouter...");
    } catch (e) {
      console.error("Groq Error:", e);
    }
  }

  // 2. Coba OpenRouter (Model Spesifik/Pintar)
  if (openRouterKey) {
    try {
      const orModels = {
        counselor: "google/gemini-flash-1.5-exp:free",
        assistant: "meta-llama/llama-3.3-70b-instruct:free",
        quiz: "tencent/hy3-preview:free",
        logic: "nvidia/nemotron-3-super-120b-a12b:free",
        gemma: "google/gemma-2-9b-it:free"
      };

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openRouterKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": orModels[task] || "openrouter/auto-free",
          "messages": [
            { "role": "system", "content": SYSTEM_PROMPTS[task] },
            ...history,
            { "role": "user", "content": userPrompt }
          ],
          "include_reasoning": true
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
    } catch (e) {
      console.error("OpenRouter Error:", e);
    }
  }

  // 3. Fallback Terakhir: Google AI Studio
  if (geminiKey) {
    return callGoogleDirect(task, userPrompt, history);
  }

  throw new Error("No AI API Keys available");
}

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
