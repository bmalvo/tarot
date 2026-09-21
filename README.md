# Tarot praca — Co Cię czeka dzisiaj w pracy?

React (Vite) + Netlify Functions: losowanie trzech kart tarota z animacją obrotu i wróżba AI po polsku (tarot + lekki absurd). **Jedna wróżba na adres IP na dzień** (strefa `Europe/Warsaw`), dzięki Netlify Blobs.

Wróżba korzysta z **Google Gemini** (darmowy tier w Google AI Studio — wystarcza na kilka–kilkadziesiąt wróżb dziennie przy małym ruchu).

## Wymagania

- Node.js 20+
- Konto [Netlify](https://www.netlify.com/) (darmowy plan: hosting + Functions)
- Konto [GitHub](https://github.com/)
- Klucz **Gemini API** z [Google AI Studio](https://aistudio.google.com/apikey) (bezpłatny limit dla hobbystycznego użycia)

## Szybki start — co zrobić krok po kroku

### 1. Klucz Gemini (free)

1. Wejdź na [Google AI Studio → API keys](https://aistudio.google.com/apikey).
2. Zaloguj się kontem Google.
3. Kliknij **Create API key** (możesz wybrać istniejący projekt Google Cloud lub utworzyć nowy).
4. Skopiuj klucz — traktuj go jak hasło (nie wrzucaj go na GitHuba).

Limit darmowy i liczba requestów zmieniają się w czasie — aktualne stawki: [Gemini API pricing](https://ai.google.dev/pricing). Przy kilku wróżbach dziennie zwykle mieszczisz się w free tier.

### 2. Projekt na komputerze

```powershell
cd C:\Users\boydm\Projects\tarot-praca
npm install
copy .env.example .env
```

W pliku `.env` wklej:

```env
GEMINI_API_KEY=twoj_klucz_tutaj
DISABLE_RATE_LIMIT=true
```

`DISABLE_RATE_LIMIT=true` ułatwia testy lokalne (bez blokady 1× dziennie na IP).

### 3. Netlify CLI (lokalnie: strona + API)

```powershell
npx netlify login
npx netlify link
```

Przy `link` wybierz istniejącą stronę albo najpierw utwórz pustą witrynę w panelu Netlify.

Uruchom:

```powershell
npm run dev:netlify
```

Otwórz adres z terminala (zwykle **http://localhost:8888**). Wypełnij formularz, odwróć karty, kliknij **Poznaj wróżbę**.

Sam `npm run dev` uruchamia tylko frontend — wróżba AI nie zadziała bez `dev:netlify`.

### 4. GitHub + publikacja w internecie

```powershell
git add .
git commit -m "Tarot praca z Gemini"
git remote add origin https://github.com/TWOJ_USER/tarot-praca.git
git push -u origin main
```

(W GitHubie wcześniej utwórz puste repo `tarot-praca`.)

W Netlify:

1. **Add new site → Import an existing project** → GitHub → to repo.
2. Build: `npm run build`, publish: `dist` (wczyta się z `netlify.toml`).
3. **Site configuration → Environment variables** → dodaj:
   - `GEMINI_API_KEY` = ten sam klucz co lokalnie
   - opcjonalnie `GEMINI_MODEL` (domyślnie `gemini-2.0-flash`)
   - opcjonalnie `RATE_LIMIT_SALT` — losowy ciąg znaków
4. **Deploy site**.

Po deployu adres typu `https://nazwa.netlify.app` — możesz z niego korzystać z telefonu i komputera. Limit **1 wróżba / IP / dzień** działa na produkcji (bez `DISABLE_RATE_LIMIT`).

### 5. Codzienne używanie

- Wejdź na swój adres Netlify.
- Imię + data urodzenia → **Losuj karty** → **Poznaj wróżbę**.
- Ta sama sieć (domowe Wi‑Fi) = jedna pełna wróżba AI na dzień; kolejne próby dostaną komunikat o limicie.

## Zmienne środowiskowe

| Zmienna | Wymagana | Opis |
|---------|----------|------|
| `GEMINI_API_KEY` | tak | Klucz z Google AI Studio |
| `GEMINI_MODEL` | nie | Domyślnie `gemini-2.0-flash` |
| `RATE_LIMIT_SALT` | nie | Sól do hashowania IP |
| `DISABLE_RATE_LIMIT` | nie | `true` tylko do testów lokalnych |

## Endpoint API

- `POST /api/interpret` — body JSON z `name`, `birthDate`, `cards` (3 szt.). Zwraca `{ "fortune": "..." }` (Markdown) lub `429` przy limicie dziennym.

## Struktura

- `src/` — frontend React
- `shared/tarotDeck.ts` — talia 78 kart
- `netlify/functions/interpret.ts` — limit IP + wywołanie AI
- `netlify/functions/lib/gemini.ts` — integracja Gemini
- `netlify/functions/lib/prompt.ts` — prompty

Obrazki kart: ilustracje Rider–Waite (linki z [sacred-texts.com](https://www.sacred-texts.com/tarot/pkt/)).

## Zmiana providera AI w przyszłości

Logika promptów jest w `lib/prompt.ts`. Wywołanie modelu jest w `lib/gemini.ts` — można dodać kolejny plik (np. OpenAI) i przełączać zmienną `AI_PROVIDER` bez zmiany frontendu.
