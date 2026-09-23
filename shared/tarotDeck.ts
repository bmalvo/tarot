// shared/tarotDecks.ts

export type TarotCardDefinition = {
  id: string
  namePl: string
  imageUrl: string
}

// Ścieżka relatywna do folderu public w React
const base = '/images/tarot'

// Tablica mapująca ID na dokładne nazwy plików dla Wielkich Arkanów (Z DUŻYCH LITER)
const majorNames: { [key: string]: string } = {
  'major-0': 'The_Fool',
  'major-1': 'The_Magician',
  'major-2': 'The_High_Priestess',
  'major-3': 'The_Empress',
  'major-4': 'The_Emperor', 
  'major-5': 'The_Hierophant',
  'major-6': 'The_Lovers',
  'major-7': 'The_Chariot',
  'major-8': 'Strength',
  'major-9': 'The_Hermit',
  'major-10': 'Wheel_of_Fortune',
  'major-11': 'Justice',
  'major-12': 'The_Hanged_Man',
  'major-13': 'Death',
  'major-14': 'Temperance',
  'major-15': 'The_Devil',
  'major-16': 'The_Tower',
  'major-17': 'The_Star',
  'major-18': 'The_Moon',
  'major-19': 'The_Sun',
  'major-20': 'Judgement',
  'major-21': 'The_World',
}

const majorRaw = [
  { id: 'major-0', namePl: 'Głupiec' },
  { id: 'major-1', namePl: 'Mag' },
  { id: 'major-2', namePl: 'Kapłanka' },
  { id: 'major-3', namePl: 'Cesarzowa' },
  { id: 'major-4', namePl: 'Cesarz' },
  { id: 'major-5', namePl: 'Kapłan' },
  { id: 'major-6', namePl: 'Kochankowie' },
  { id: 'major-7', namePl: 'Rydwan' },
  { id: 'major-8', namePl: 'Siła' },
  { id: 'major-9', namePl: 'Pustelnik' },
  { id: 'major-10', namePl: 'Koło Fortuny' },
  { id: 'major-11', namePl: 'Sprawiedliwość' },
  { id: 'major-12', namePl: 'Wisielec' },
  { id: 'major-13', namePl: 'Śmierć' },
  { id: 'major-14', namePl: 'Umiarkowanie' },
  { id: 'major-15', namePl: 'Diabeł' },
  { id: 'major-16', namePl: 'Wieża' },
  { id: 'major-17', namePl: 'Gwiazda' },
  { id: 'major-18', namePl: 'Księżyc' },
  { id: 'major-19', namePl: 'Słońce' },
  { id: 'major-20', namePl: 'Sąd' },
  { id: 'major-21', namePl: 'Świat' },
]

const major: TarotCardDefinition[] = majorRaw.map((card) => ({
  ...card,
  imageUrl: `${base}/${majorNames[card.id]}.png`, // Bez toLowerCase()! np. /images/tarot/The_Fool.png
}))

function minor(
  suit: 'wands' | 'cups' | 'swords' | 'pentacles',
  suitEnName: string, // np. Cups, Wands, Swords, Pentacles z dużej litery
  labelPl: string,
): TarotCardDefinition[] {
  const namesPl = [
    `As ${labelPl}`, `Dwójka ${labelPl}`, `Trójka ${labelPl}`, `Czwórka ${labelPl}`,
    `Piątka ${labelPl}`, `Szóstka ${labelPl}`, `Siódemka ${labelPl}`, `Ósemka ${labelPl}`,
    `Dziewiątka ${labelPl}`, `Dziesiątka ${labelPl}`, `Paź ${labelPl}`, `Rycerz ${labelPl}`,
    `Królowa ${labelPl}`, `Król ${labelPl}`,
  ]

  // Nazwy angielskie z dużych liter pasujące do Ace_of_Cups.png, Two_of_Cups.png...
  const namesEn = [
    'Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Page', 'Knight', 'Queen', 'King'
  ]

  return namesPl.map((namePl, i) => {
    const num = String(i + 1).padStart(2, '0')
    const fileName = `${namesEn[i]}_of_${suitEnName}.png` // np. Ace_of_Cups.png
    
    return {
      id: `${suit}-${num}`,
      namePl,
      imageUrl: `${base}/${fileName}`,
    }
  })
}

export const TAROT_DECK: TarotCardDefinition[] = [
  ...major,
  // Przekazujemy nazwy kolorów z dużej litery, aby pasowały do plików (Cups, Wands...)
  ...minor('wands', 'Wands', 'Buław'),
  ...minor('cups', 'Cups', 'Kielichów'),
  ...minor('swords', 'Swords', 'Mieczy'),
  ...minor('pentacles', 'Pentacles', 'Pentakli'),
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
