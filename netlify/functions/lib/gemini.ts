import { SYSTEM_PROMPT } from './prompt'

type GeminiResponse = {
  candidates?: {
    content?: { parts?: { text?: string }[] }
    finishReason?: string
  }[]
  error?: { message?: string }
}

export async function generateFortuneWithGemini(userPrompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('Brak GEMINI_API_KEY po stronie serwera.')
  }

  const model = process.env.GEMINI_MODEL ?? 'gemini-3.5-flash-lite'
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }],
        },
      ],
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 1024,
      },
    }),
  })

  const data = (await res.json()) as GeminiResponse

  if (!res.ok) {
    const msg = data.error?.message ?? (await res.text()).slice(0, 400)
    throw new Error(`Gemini ${res.status}: ${msg}`)
  }

  const text = data.candidates?.[0]?.content?.parts
    ?.map((p) => p.text ?? '')
    .join('')
    .trim()

  if (!text) {
    const reason = data.candidates?.[0]?.finishReason ?? 'unknown'
    throw new Error(`Pusta odpowiedź modelu (finish: ${reason}).`)
  }

  return text
}
