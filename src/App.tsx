import { useCallback, useState } from 'react'
import Markdown from 'react-markdown'
import type { DrawnCard } from '../shared/tarotDeck'
import { TarotCard } from './components/TarotCard'
import { drawThreeCards } from './lib/drawCards'
import './App.css'

type Phase = 'form' | 'cards' | 'fortune'

type JobSector = 'auchan' | 'eo' | 'other'

type UserInfo = {
  name: string
  birthDate: string
  sector: JobSector
}

async function fetchFortune(
  user: UserInfo,
  cards: DrawnCard[],
): Promise<string> {
  const res = await fetch('/api/interpret', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: user.name,
      birthDate: user.birthDate,
      sector: user.sector,
      cards: cards.map((c) => ({
        id: c.id,
        orientation: c.orientation,
        positionLabel: c.positionLabel,
      })),
    }),
  })

  const data = (await res.json()) as { fortune?: string; error?: string }
  if (!res.ok) {
    throw new Error(data.error ?? 'Coś poszło nie tak.')
  }
  if (!data.fortune) {
    throw new Error('Pusta wróżba — spróbuj ponownie.')
  }
  return data.fortune
}

export default function App() {
  const [phase, setPhase] = useState<Phase>('form')
  const [user, setUser] = useState<UserInfo>({ name: '', birthDate: '', sector: 'other' })
  const [cards, setCards] = useState<DrawnCard[]>([])
  const [revealed, setRevealed] = useState(false)
  const [fortune, setFortune] = useState<string | null>(null)
  const [loadingFortune, setLoadingFortune] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startReading = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFortune(null)
    const name = user.name.trim()
    if (!name) {
      setError('Podaj imię, żeby karty wiedziały, do kogo mówią.')
      return
    }
    if (!user.birthDate) {
      setError('Data urodzenia pomoże dobrać ton wróżby.')
      return
    }
    setCards(drawThreeCards())
    setRevealed(false)
    setPhase('cards')
    window.setTimeout(() => setRevealed(true), 400)
  }

  const requestFortune = useCallback(async () => {
    if (!revealed || loadingFortune) return
    setLoadingFortune(true)
    setError(null)
    try {
      const text = await fetchFortune(user, cards)
      setFortune(text)
      setPhase('fortune')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Błąd połączenia.')
    } finally {
      setLoadingFortune(false)
    }
  }, [cards, loadingFortune, revealed, user])

  const reset = () => {
    setPhase('form')
    setCards([])
    setRevealed(false)
    setFortune(null)
    setError(null)
  }

  return (
    <div className="app">
      <div className="app__glow" aria-hidden />
      <header className="app__header">
        <p className="app__eyebrow">Tarot dnia roboczego</p>
        <h1>Co Cię czeka dzisiaj w pracy?</h1>
        <p className="app__lead">
          Wpisz imię, datę urodzenia oraz wybierz swoją branżę. Wylosuj trzy karty i pozwól, aby 
          symbolika tarota połączyła się z kosmicznym horoskopem Twojego zawodu.
        </p>
      </header>

      <main className="app__main">
        {phase === 'form' && (
          <form className="form" onSubmit={startReading}>
            <label className="form__field">
              <span>Imię</span>
              <input
                type="text"
                autoComplete="given-name"
                maxLength={80}
                value={user.name}
                onChange={(e) =>
                  setUser((u) => ({ ...u, name: e.target.value }))
                }
                placeholder="np. Ania"
              />
            </label>
            <label className="form__field">
              <span>Data urodzenia</span>
              <input
                type="date"
                value={user.birthDate}
                onChange={(e) =>
                  setUser((u) => ({ ...u, birthDate: e.target.value }))
                }
              />
            </label>

            <label className="form__field">
              <span>Branża</span>
              <select
  value={user.sector}
  onChange={(e) =>
    setUser((u) => ({ ...u, sector: e.target.value as JobSector }))
  }
  style={{
    padding: '0.6rem',
    borderRadius: '6px',
    border: '1px solid rgba(255, 215, 160, 0.2)',
    background: '#0f0a18',
    color: '#ffffff',
    fontSize: '1rem',
    cursor: 'pointer',
    width: '100%',
    outline: 'none',
    boxSizing: 'border-box'
  }}
>
  <option value="other" style={{ background: '#0f0a18', color: '#ffffff' }}>Ogólna</option>
  <option value="auchan" style={{ background: '#0f0a18', color: '#ffffff' }}>Auchan</option>
  <option value="eo" style={{ background: '#0f0a18', color: '#ffffff' }}>EO</option>
</select>
            </label>

            {error && <p className="app__error">{error}</p>}
            <button type="submit" className="btn btn--primary">
              Losuj karty
            </button>
          </form>
        )}

        {(phase === 'cards' || phase === 'fortune') && cards.length === 3 && (
          <section className="reading" aria-live="polite">
            <p className="reading__for">
              Wróżba dla <strong>{user.name.trim()}</strong>
            </p>
            <div className="reading__cards">
              {cards.map((card, i) => (
                <TarotCard
                  key={card.id}
                  card={card}
                  revealed={revealed}
                  delayMs={i * 180}
                />
              ))}
            </div>

            {phase === 'cards' && revealed && (
              <div className="reading__actions">
                <button
                  type="button"
                  className="btn btn--primary"
                  disabled={loadingFortune}
                  onClick={() => void requestFortune()}
                >
                  {loadingFortune ? 'Karty szepczą…' : 'Poznaj wróżbę'}
                </button>
              </div>
            )}

            {error && <p className="app__error">{error}</p>}

            {phase === 'fortune' && fortune && (
              <article className="fortune markdown-body">
                <Markdown>{fortune}</Markdown>
              </article>
            )}

            {phase === 'fortune' && (
              <p className="disclaimer">
                To rozrywkowa interpretacja symboli — traktuj ją jak dobrą
                kawę: pobudza wyobraźnię, nie zastępuje rozsądku.
              </p>
            )}
          </section>
        )}
      </main>

      {phase !== 'form' && (
        <footer className="app__footer">
          <button type="button" className="btn btn--ghost" onClick={reset}>
            Nowe losowanie
          </button>
        </footer>
      )}
    </div>
  )
}
