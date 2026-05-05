# Quotidian — Full Project Plan

> A daily quote web app with search, a quote chatbot, shareable cards, and user accounts.
> Stack: React + Vite · Supabase · Gemini API · Quotable API · Vercel

---

## What is Quotidian?

**Quotidian** (adjective): _of or occurring every day; daily._

A clean, minimal web app where users can:

- See a personal random quote every day — different for every user, stable across refreshes
- Search quotes by keyword or author
- Chat with an AI that only talks about quotes
- Save favourite quotes to a personal collection
- Download or share beautiful quote cards as images

---

## Tech Stack

| Layer           | Tool                                  | Cost      |
| --------------- | ------------------------------------- | --------- |
| Frontend        | React + Vite + React Router v6        | Free      |
| Styling         | Tailwind CSS                          | Free      |
| Card generation | html-to-image (browser library)       | Free      |
| Hosting         | Vercel                                | Free      |
| Auth            | Supabase Auth (Email, Google, GitHub) | Free      |
| Database        | Supabase Postgres                     | Free      |
| Backend API     | Supabase Edge Functions               | Free      |
| Quotes data     | ZenQuotes API (zenquotes.io)          | Free      |
| Chatbot AI      | Google Gemini 2.5 Flash-Lite          | Free tier |

**Estimated monthly cost for a student project: ~$0**

---

## Quote of the Day — Personal Approach

Every user sees a **different quote** on the home page — personal to them,
not shared with anyone else. This makes the experience feel fresh and
individual rather than like a broadcast.

The quote is **stable for the day** — it does not change on every refresh.
Refreshing the page shows the same quote until midnight, then a new one appears.

### How it works (localStorage — no database needed)

1. On page load, check `localStorage` for a stored quote and its date
2. If a quote exists and its date matches today → show it (no API call)
3. If no quote exists, or the stored date is yesterday → fetch a new random
   quote from Quotable API, save it to `localStorage` with today's date
4. Display the quote

This is entirely client-side. No server, no database table, no cost.
Every user gets their own fresh quote, privately stored in their own browser.

```js
// Key stored in localStorage
'quotidian_daily_quote' = {
  date: '2026-05-05',       // today's date as YYYY-MM-DD
  content: 'Quote text...',
  author: 'Author Name',
  tags: ['wisdom', 'life'],
  sourceId: 'abc123'
}
```

---

## Features

### Feature 1 — Quote of the Day

- Every user sees a different random quote — personal to them
- Stable for the day — does not change on refresh
- Stored in localStorage with today's date, expires at midnight
- No database or Edge Function needed for this feature
- User can: save to favourites, download as card, share card

### Feature 2 — Search Quotes

- Search by keyword, author name, or tag
- Results from Quotable API search endpoint via Edge Function
- Fuzzy search (handles typos)
- Each result card has: save to favourites, download card, share card

### Feature 3 — Quote Chatbot

- Full chat interface
- Powered by Gemini 2.5 Flash-Lite (free tier)
- System prompt locks it to quotes only — refuses off-topic messages
- Can discuss: meaning, author background, historical context, similar quotes

### Feature 4 — Favourites (login required)

- Save any quote from anywhere in the app
- View all saved quotes on the Favourites page
- Remove quotes from favourites
- Download or share any saved quote as a card

### Feature 5 — Quote Cards (shareable images)

- Generate a beautiful image of any quote
- 5 themes: Minimal Light, Minimal Dark, Gradient Sunset,
  Gradient Ocean, Gradient Forest
- Actions: Download PNG, Copy to clipboard, Share to WhatsApp, Share to Twitter/X
- No Quotidian branding — clean and shareable
- Available on: quote of the day, search results, saved favourites

### Feature 6 — Auth

- Email + Password signup/login
- Google OAuth
- GitHub OAuth
- Row Level Security ensures users only ever see their own data

---

## Pages & Routes

| Route         | Page            | Auth required | Notes                         |
| ------------- | --------------- | ------------- | ----------------------------- |
| `/`           | Home            | No            | Quote of the day              |
| `/search`     | Search          | No            | Search + results              |
| `/chat`       | Chatbot         | No            | AI quote assistant            |
| `/favourites` | Favourites      | Yes           | Redirect to /login if not     |
| `/login`      | Login / Sign up | No            | Redirect home if logged in    |
| `/profile`    | Profile         | Yes           | User info + saved quote count |

---

## Build Phases

### Phase 1 — Project Scaffold

- Vite + React + Tailwind setup
- React Router with all routes wired (empty pages)
- Navbar component built
- Supabase project created, env variables configured
- Deploy empty app to Vercel to confirm the pipeline works

### Phase 2 — Quote of the Day

- No Supabase table needed for this feature
- `useDailyQuote` hook handles localStorage logic entirely
- On load: check localStorage → if stale or missing, fetch from Quotable API directly
- Home page displays the quote with save + share buttons
- Basic QuoteCard component built here (reused everywhere)

### Phase 3 — Search

- Search page with input + results
- Edge Function proxies Quotable API search
- Results displayed as quote cards

### Phase 4 — Auth

- Supabase Auth: Email, Google, GitHub configured
- Login page built
- AuthContext in React — user state available everywhere
- ProtectedRoute wrapper component

### Phase 5 — Favourites

- `saved_quotes` table with RLS policies
- Save/unsave button on every quote card
- Favourites page

### Phase 6 — Quote Cards

- CardModal component with live preview
- Theme selector (5 themes)
- html-to-image generates PNG in browser
- Download, clipboard copy, WhatsApp share, Twitter share

### Phase 7 — Chatbot

- Gemini API key stored in Supabase secrets (never in frontend)
- Edge Function proxies messages to Gemini
- Chat UI with message history

### Phase 8 — Profile Page

- User info display (name, email, avatar initial)
- Saved quote count with link to Favourites
- Member since date

### Phase 9 — Polish + Deploy

- Loading skeletons on all async components
- Error boundary components
- Mobile responsive audit
- Final Vercel deploy with production env vars

---

## Auth Setup Guides

### Google OAuth

1. Go to console.cloud.google.com → New project
2. APIs & Services → Credentials → Create OAuth 2.0 Client ID
3. Authorized redirect URI: `https://[your-ref].supabase.co/auth/v1/callback`
4. Supabase Dashboard → Authentication → Providers → Google → paste Client ID + Secret

### GitHub OAuth

1. github.com/settings/developers → New OAuth App
2. Callback URL: `https://[your-ref].supabase.co/auth/v1/callback`
3. Supabase Dashboard → Authentication → Providers → GitHub → paste Client ID + Secret

---

## Card Sharing — Technical Approach

Cards are generated entirely in the browser — no server, no cost.

1. User clicks "Share" on any quote
2. Modal opens with live card preview
3. User picks a theme
4. `html-to-image` renders the preview div as a PNG blob
5. Actions:
   - **Download PNG** → browser download trigger
   - **Copy to clipboard** → Clipboard API writes PNG blob
   - **WhatsApp** → `https://wa.me/?text=` with quote + site link
   - **Twitter/X** → `https://twitter.com/intent/tweet` with quote text

Note: Social share buttons share the quote text + a link to Quotidian.
The actual image file is available via download and clipboard copy.

---

## Environment Variables

### Frontend .env (safe to have, never has secrets)

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Supabase Edge Function secrets (set via Supabase Dashboard)

```
GEMINI_API_KEY=your_gemini_key_here
```

The Gemini key must NEVER go in the frontend .env file.
