// import { createHash } from 'node:crypto'
// import { getStore } from '@netlify/blobs'
// import type { HandlerEvent } from '@netlify/functions'

// const TIME_ZONE = 'Europe/Warsaw'

// export function warsawDateKey(now = new Date()): string {
//   return new Intl.DateTimeFormat('en-CA', {
//     timeZone: TIME_ZONE,
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//   }).format(now)
// }

// export function warsawTodayLabel(now = new Date()): string {
//   return new Intl.DateTimeFormat('pl-PL', {
//     timeZone: TIME_ZONE,
//     weekday: 'long',
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//   }).format(now)
// }

// function secondsUntilWarsawMidnight(now = new Date()): number {
//   const parts = new Intl.DateTimeFormat('en-US', {
//     timeZone: TIME_ZONE,
//     hour: 'numeric',
//     minute: 'numeric',
//     second: 'numeric',
//     hour12: false,
//   }).formatToParts(now)
//   const get = (type: string) =>
//     Number(parts.find((p) => p.type === type)?.value ?? 0)
//   const h = get('hour')
//   const m = get('minute')
//   const s = get('second')
//   const elapsed = h * 3600 + m * 60 + s
//   return Math.max(60, 86400 - elapsed)
// }

// export function clientIp(event: HandlerEvent): string {
//   const h = event.headers
//   return (
//     h['x-nf-client-connection-ip'] ??
//     h['client-ip'] ??
//     h['x-forwarded-for']?.split(',')[0]?.trim() ??
//     'unknown'
//   )
// }

// function ipHash(ip: string): string {
//   const salt = process.env.RATE_LIMIT_SALT ?? 'tarot-praca-local'
//   return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 32)
// }

// export type RateLimitResult =
//   | { ok: true }
//   | { ok: false; message: string }

// function fortuneKey(event: HandlerEvent): string {
//   const ip = clientIp(event)
//   const dateKey = warsawDateKey()
//   return `fortune:${dateKey}:${ipHash(ip)}`
// }

// export async function assertDailyFortuneAvailable(
//   event: HandlerEvent,):
//   Promise<RateLimitResult> {
//   if (process.env.DISABLE_RATE_LIMIT === 'true') {
//     return { ok: true }
//   }

//   const store = getStore({ name: 'fortune-limits', consistency: 'strong' })
//   const existing = await store.get(fortuneKey(event))
//   if (existing) {
//     return {
//       ok: false,
//       message:
//         'Dziś już wylosowałeś wróżbę z tej sieci. Wróć jutro — karty też lubią odpoczywać.',
//     }
//   }

//   return { ok: true }
// }



// export async function recordDailyFortune(event: HandlerEvent): Promise<void> {
//   if (process.env.DISABLE_RATE_LIMIT === 'true') {
//     return
//   }



//   const store = getStore({ name: 'fortune-limits', consistency: 'strong' })
//   const ttl = secondsUntilWarsawMidnight()
//   await store.set(fortuneKey(event), '1', {
//     metadata: { dateKey: warsawDateKey() },
//     expirationTtl: ttl,
//   })
// }


export async function assertDailyFortuneAvailable(event: any) {
  // Zwracamy sukces, całkowicie omijając bazę danych Netlify Blobs
  return { ok: true, message: 'Dostępny' }
}

export async function recordDailyFortune(event: any) {
  // Pusta funkcja, nic nie zapisujemy i nic nie wyrzuca błędów
  return
}

export function warsawTodayLabel(): string {
  // Zwraca aktualną datę w formacie YYYY-MM-DD
  const date = new Date()
  const offset = 2 // Strefa czasowa Warszawy (uproszczona)
  const warsawDate = new Date(date.getTime() + offset * 60 * 60 * 1000)
  return warsawDate.toISOString().split('T')[0]
}