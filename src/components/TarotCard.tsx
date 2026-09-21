import type { DrawnCard } from '../../shared/tarotDeck'
import './TarotCard.css'

type Props = {
  card: DrawnCard
  revealed: boolean
  delayMs?: number
  onFlipComplete?: () => void
}

export function TarotCard({
  card,
  revealed,
  delayMs = 0,
  onFlipComplete,
}: Props) {
  return (
    <article className="tarot-slot">
      <p className="tarot-slot__label">{card.positionLabel}</p>
      <button
        type="button"
        className={`tarot-card ${revealed ? 'tarot-card--revealed' : ''}`}
        style={{ transitionDelay: `${delayMs}ms` }}
        aria-label={
          revealed
            ? `${card.namePl}, ${card.orientation === 'reversed' ? 'odwrócona' : 'prosta'}`
            : 'Zakryta karta tarota'
        }
        onTransitionEnd={(e) => {
          if (e.propertyName === 'transform' && revealed) {
            onFlipComplete?.()
          }
        }}
      >
        <div className="tarot-card__inner">
          <div className="tarot-card__face tarot-card__face--back" aria-hidden={revealed}>
            <span className="tarot-card__sigil">✦</span>
          </div>
          <div
            className={`tarot-card__face tarot-card__face--front ${card.orientation === 'reversed' ? 'tarot-card__face--reversed' : ''}`}
            aria-hidden={!revealed}
          >
            <img src={card.imageUrl} alt="" loading="lazy" />
            <span className="tarot-card__name">{card.namePl}</span>
          </div>
        </div>
      </button>
    </article>
  )
}
