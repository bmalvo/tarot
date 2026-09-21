export type TarotCardDefinition = {
  id: string
  namePl: string
  imageUrl: string
}

const base = 'https://www.sacred-texts.com/tarot/pkt/img'

const major: TarotCardDefinition[] = [
  { id: 'major-0', namePl: 'Głupiec', imageUrl: `${base}/ar00.jpg` },
  { id: 'major-1', namePl: 'Mag', imageUrl: `${base}/ar01.jpg` },
  { id: 'major-2', namePl: 'Kapłanka', imageUrl: `${base}/ar02.jpg` },
  { id: 'major-3', namePl: 'Cesarzowa', imageUrl: `${base}/ar03.jpg` },
  { id: 'major-4', namePl: 'Cesarz', imageUrl: `${base}/ar04.jpg` },
  { id: 'major-5', namePl: 'Kapłan', imageUrl: `${base}/ar05.jpg` },
  { id: 'major-6', namePl: 'Kochankowie', imageUrl: `${base}/ar06.jpg` },
  { id: 'major-7', namePl: 'Rydwan', imageUrl: `${base}/ar07.jpg` },
  { id: 'major-8', namePl: 'Siła', imageUrl: `${base}/ar08.jpg` },
  { id: 'major-9', namePl: 'Pustelnik', imageUrl: `${base}/ar09.jpg` },
  { id: 'major-10', namePl: 'Koło Fortuny', imageUrl: `${base}/ar10.jpg` },
  { id: 'major-11', namePl: 'Sprawiedliwość', imageUrl: `${base}/ar11.jpg` },
  { id: 'major-12', namePl: 'Wisielec', imageUrl: `${base}/ar12.jpg` },
  { id: 'major-13', namePl: 'Śmierć', imageUrl: `${base}/ar13.jpg` },
  { id: 'major-14', namePl: 'Umiarkowanie', imageUrl: `${base}/ar14.jpg` },
  { id: 'major-15', namePl: 'Diabeł', imageUrl: `${base}/ar15.jpg` },
  { id: 'major-16', namePl: 'Wieża', imageUrl: `${base}/ar16.jpg` },
  { id: 'major-17', namePl: 'Gwiazda', imageUrl: `${base}/ar17.jpg` },
  { id: 'major-18', namePl: 'Księżyc', imageUrl: `${base}/ar18.jpg` },
  { id: 'major-19', namePl: 'Słońce', imageUrl: `${base}/ar19.jpg` },
  { id: 'major-20', namePl: 'Sąd', imageUrl: `${base}/ar20.jpg` },
  { id: 'major-21', namePl: 'Świat', imageUrl: `${base}/ar21.jpg` },
]

function minor(
  suit: 'wands' | 'cups' | 'swords' | 'pentacles',
  prefix: string,
  label: string,
): TarotCardDefinition[] {
  const names = [
    `As ${label}`,
    `Dwójka ${label}`,
    `Trójka ${label}`,
    `Czwórka ${label}`,
    `Piątka ${label}`,
    `Szóstka ${label}`,
    `Siódemka ${label}`,
    `Ósemka ${label}`,
    `Dziewiątka ${label}`,
    `Dziesiątka ${label}`,
    `Paź ${label}`,
    `Rycerz ${label}`,
    `Królowa ${label}`,
    `Król ${label}`,
  ]
  return names.map((namePl, i) => {
    const num = String(i + 1).padStart(2, '0')
    return {
      id: `${suit}-${num}`,
      namePl,
      imageUrl: `${base}/${prefix}${num}.jpg`,
    }
  })
}

export const TAROT_DECK: TarotCardDefinition[] = [
  ...major,
  ...minor('wands', 'wa', 'Buław'),
  ...minor('cups', 'cu', 'Kielichów'),
  ...minor('swords', 'sw', 'Mieczy'),
  ...minor('pentacles', 'pe', 'Pentakli'),
]

export const TAROT_BY_ID = new Map(TAROT_DECK.map((c) => [c.id, c]))

export const POSITION_LABELS = [
  'Sytuacja na start dnia',
  'Co wymknie się kontroli',
  'Rada na domknięcie dnia',
] as const

export type CardOrientation = 'upright' | 'reversed'

export type DrawnCard = {
  id: string
  namePl: string
  imageUrl: string
  orientation: CardOrientation
  positionLabel: string
}
