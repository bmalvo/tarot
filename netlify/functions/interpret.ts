import type { Handler, HandlerEvent } from '@netlify/functions'
import {
  TAROT_BY_ID,
  type CardOrientation,
  type DrawnCard,
} from '../../shared/tarotDeck'
import { generateFortuneWithGemini } from './lib/gemini'
import { buildUserPrompt } from './lib/prompt'
import {
  assertDailyFortuneAvailable,
  recordDailyFortune,
  warsawTodayLabel,
} from './lib/rateLimit'

type RequestCard = {
  id: string
  orientation: CardOrientation
  positionLabel: string
}

type RequestBody = {
  name?: string
  birthDate?: string
  cards?: RequestCard[]
}

const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  },
  body: JSON.stringify(body),
})

function parseBody(event: HandlerEvent): RequestBody | null {
  if (!event.body) return null
  try {
    return JSON.parse(event.body) as RequestBody
  } catch {
    return null
  }
}

function validateCards(cards: RequestCard[] | undefined): DrawnCard[] | string {
  if (!cards || cards.length !== 3) {
    return 'Potrzebne są dokładnie trzy karty.'
  }
  const ids = new Set<string>()
  const resolved: DrawnCard[] = []
  for (const c of cards) {
    if (ids.has(c.id)) return 'Karty nie mogą się powtarzać.'
    const def = TAROT_BY_ID.get(c.id)
    if (!def) return `Nieznana karta: ${c.id}`
    if (c.orientation !== 'upright' && c.orientation !== 'reversed') {
      return 'Nieprawidłowa orientacja karty.'
    }
    if (!c.positionLabel?.trim()) return 'Brak etykiety pozycji karty.'
    ids.add(c.id)
    resolved.push({
      id: def.id,
      namePl: def.namePl,
      imageUrl: def.imageUrl,
      orientation: c.orientation,
      positionLabel: c.positionLabel.trim(),
    })
  }
  return resolved
}

function validateBirthDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    }
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Użyj metody POST.' })
  }

  const body = parseBody(event)
  if (!body) {
    return json(400, { error: 'Nieprawidłowy JSON w żądaniu.' })
  }

  const name = body.name?.trim()
  if (!name || name.length > 80) {
    return json(400, { error: 'Podaj imię (max 80 znaków).' })
  }

  const birthDate = body.birthDate?.trim()
  if (!birthDate || !validateBirthDate(birthDate)) {
    return json(400, { error: 'Podaj datę urodzenia (RRRR-MM-DD).' })
  }

  const cardsResult = validateCards(body.cards)
  if (typeof cardsResult === 'string') {
    return json(400, { error: cardsResult })
  }

  const limit = await assertDailyFortuneAvailable(event)
  if (!limit.ok) {
    return json(429, { error: limit.message })
  }

  try {
    const userPrompt = buildUserPrompt(
      name,
      birthDate,
      warsawTodayLabel(),
      cardsResult,
    )
    const fortune = await generateFortuneWithGemini(userPrompt)
    await recordDailyFortune(event)
    return json(200, { fortune })
  } catch (e) {
    const message =
      e instanceof Error ? e.message : 'Nie udało się wygenerować wróżby.'
    console.error(message)
    return json(502, {
      error:
        'Karty na chwilę milczą. Spróbuj za moment — albo sprawdź konfigurację AI na serwerze.',
      detail: process.env.NETLIFY_DEV === 'true' ? message : undefined,
    })
  }
}
