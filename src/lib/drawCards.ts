import {
  POSITION_LABELS,
  TAROT_DECK,
  type CardOrientation,
  type DrawnCard,
} from '../../shared/tarotDeck'

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function randomOrientation(): CardOrientation {
  return Math.random() < 0.5 ? 'upright' : 'reversed'
}

export function drawThreeCards(): DrawnCard[] {
  const picked = shuffle(TAROT_DECK).slice(0, 3)
  return picked.map((card, index) => ({
    id: card.id,
    namePl: card.namePl,
    imageUrl: card.imageUrl,
    orientation: randomOrientation(),
    positionLabel: POSITION_LABELS[index],
  }))
}
