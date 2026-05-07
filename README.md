# Quotidian

> *Your daily dose of wisdom.*

A clean, minimal quote web app where every visit feels personal. Discover a new quote every day, search through half a million quotes, chat with an AI that lives and breathes literature, and save the ones that stay with you.

---

## ✨ Features

### 📖 Quote of the Day
Every user gets their own personal daily quote — different from everyone else's, stable across refreshes, and fresh again at midnight. Powered by your own browser, no server needed.

### 🔍 Discover & Search
A beautiful quote feed with 10 new randomized quotes every visit. Search through 500,000+ quotes by keyword or author using full-text search powered by PostgreSQL. Results are ranked, paginated, and fast.

### 🤖 Quote Chatbot
A floating AI assistant that only talks about quotes. Ask about meaning, context, authors, themes, or similar quotes. Powered by Google Gemini. Knows when to stay in its lane.

### ❤️ Favourites
Save any quote from anywhere in the app. Build your personal collection. Requires an account — your favourites follow you.

### 🎨 Shareable Quote Cards
Turn any quote into a beautiful image. Choose from 5 themes — Minimal Light, Minimal Dark, Gradient Sunset, Gradient Ocean, Gradient Forest. Download as PNG, copy to clipboard, or share directly to WhatsApp and Twitter.

### 🔐 Authentication
Sign in with Email & Password, Google, or GitHub. Password strength enforcement, email confirmation, forgot password flow, and change password — all handled.

---

## 🛠 Tech Stack

| Layer | Tool |
|---|---|
| Frontend | React 18 + Vite + React Router v6 |
| Styling | Tailwind CSS |
| Card Generation | html-to-image |
| Hosting | Vercel |
| Auth | Supabase Auth |
| Database | Supabase Postgres |
| Backend | Supabase Edge Functions (Deno) |
| Quotes Dataset | 500k quotes (Kaggle) |
| Chatbot | Google Gemini 2.5 Flash |

**Estimated monthly cost: ~$0**

---

## 🗄 Database

Three tables, all on Supabase Postgres:

```
quotes         — 500k quotes imported from dataset (public read)
saved_quotes   — user's saved quotes (RLS protected)
profiles       — user display names and avatars (RLS protected)
```

Full-text search is powered by a GIN index on a generated `tsvector` column combining author and content. Trigram indexes on author and content enable fuzzy partial matching.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project
- A Google Gemini API key (free tier)

### 1. Clone the repo
```bash
git clone https://github.com/tarek-hasan33/Quotidian
cd quotidian
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
```

Fill in your `.env`:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set up the database
Run the SQL from `docs/DATABASE.md` in your Supabase SQL Editor.

### 5. Set up Edge Function secrets
In Supabase Dashboard → Edge Functions → Secrets:
```
GEMINI_API_KEY=your_gemini_api_key
```

### 6. Deploy Edge Functions
```bash
supabase login
supabase link --project-ref your-project-ref
supabase functions deploy get-daily-quote
supabase functions deploy search-quotes
supabase functions deploy chat
```

### 7. Start the dev server
```bash
npm run dev
```

Open `http://localhost:5173`

---

## 📁 Project Structure

```
quotidian/
├── src/
│   ├── components/
│   │   ├── auth/          # Login form pieces
│   │   ├── card/          # Quote card generation
│   │   ├── chat/          # Chat bubble and messages
│   │   ├── layout/        # Navbar, ProtectedRoute
│   │   ├── quote/         # QuoteCard, SaveButton, Tags
│   │   └── ui/            # Button, Modal, Spinner, EmptyState
│   ├── context/           # AuthContext
│   ├── hooks/             # useAuth, useDailyQuote, useSearch, useSavedQuotes
│   ├── lib/               # Supabase client
│   └── pages/             # Home, Feed, Favourites, Login, Profile
├── supabase/
│   └── functions/
│       ├── get-daily-quote/   # Random quote from DB
│       ├── search-quotes/     # Full-text search
│       └── chat/              # Gemini API proxy
├── docs/                  # Planning, design, database docs
└── .github/
    └── workflows/
        └── keep-alive.yml     # Pings Supabase every 3 days
```

---

## 🔒 Security

- No API keys in frontend code — all secrets live in Supabase Edge Function environment
- Supabase Row Level Security on all user tables
- Password strength enforcement on signup (8+ chars, uppercase, special character)
- Chat rate limiting (10 messages/day for guests, 50 for logged-in users)
- Input sanitization on search queries
- Generic error messages — no internal details exposed to client

---

## 🌐 Deployment

Deployed on **Vercel** with automatic deployments on every push to `main`.

A GitHub Action pings the Supabase database every 3 days to prevent the free tier project from pausing due to inactivity.

---

## 📚 Documentation

Full planning and technical documentation lives in the `docs/` folder:

| File | Contents |
|---|---|
| `PLANNING.md` | Full feature plan, tech decisions, build phases |
| `DESIGN.md` | Color palette, typography, component styles |
| `DATABASE.md` | Schema, RLS policies, SQL setup |
| `FILE_STRUCTURE.md` | Every file explained |
| `QUICK_REFERENCE.md` | Commands, endpoints, cheatsheet |

---

## 🙏 Acknowledgements

- Quotes dataset from [Kaggle](https://www.kaggle.com/datasets/manann/quotes-500k)
- Icons from [Lucide](https://lucide.dev)
- Fonts: [Lora](https://fonts.google.com/specimen/Lora) and [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts
- Built with the help of GitHub Copilot and Claude

---

## 📄 License

MIT License — feel free to use, modify, and build on this project.

---

<p align="center">Made with ☕ and too many quotes</p>
