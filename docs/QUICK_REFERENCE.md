# Quotidian — Quick Reference

A cheatsheet to keep open while building.

---

## Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Deploy Supabase Edge Functions
supabase functions deploy get-daily-quote
supabase functions deploy search-quotes
supabase functions deploy chat

# Set Gemini secret in Supabase (run once)
supabase secrets set GEMINI_API_KEY=your_key_here
```

---

## External URLs

| Service | URL |
|---|---|
| Supabase Dashboard | https://app.supabase.com |
| Vercel Dashboard | https://vercel.com/dashboard |
| Google Cloud Console (for OAuth) | https://console.cloud.google.com |
| GitHub Developer Settings (for OAuth) | https://github.com/settings/developers |
| Google AI Studio (get Gemini key) | https://aistudio.google.com |
| Quotable API docs | https://github.com/lukePeavey/quotable |

---

## Quotable API Endpoints

```
Random quote:     GET https://api.quotable.io/random
Search quotes:    GET https://api.quotable.io/search/quotes?query=wisdom
Quote by ID:      GET https://api.quotable.io/quotes/:id
List tags:        GET https://api.quotable.io/tags
```

---

## Supabase Tables

```
quotes         — id, content, author, tags[], language  (~500k rows, public read)
saved_quotes   — id, user_id, content, author, tags[], source_id, saved_at
profiles       — id, display_name, avatar_url, created_at, updated_at

Quote of the day → random row from quotes table, cached in localStorage
```

---

## Edge Functions

```
get-daily-quote  — picks random quote from Supabase quotes table
search-quotes    — full text search on Supabase quotes table
chat             — proxies to Gemini 2.0 Flash API
```

---

## Card Themes

| ID | Name | Style |
|---|---|---|
| `minimal-light` | Minimal Light | White/cream background |
| `minimal-dark` | Minimal Dark | Dark background, light text |
| `gradient-sunset` | Gradient Sunset | Orange → Pink → Purple |
| `gradient-ocean` | Gradient Ocean | Sky blue → Indigo |
| `gradient-forest` | Gradient Forest | Emerald → Cyan |

---

## Protected Routes

`/favourites` and `/profile` require login.
Wrap with `<ProtectedRoute>` in App.jsx:

```jsx
<Route path="/favourites" element={
  <ProtectedRoute><Favourites /></ProtectedRoute>
} />
```

---

## Auth Redirect URIs (add these in Google / GitHub dashboards)

```
https://[your-project-ref].supabase.co/auth/v1/callback
```

---

## Font Classes (Tailwind custom)

Add to tailwind.config.js:

```js
theme: {
  extend: {
    fontFamily: {
      serif: ['Lora', 'Georgia', 'serif'],
      sans: ['Inter', 'system-ui', 'sans-serif'],
    }
  }
}
```

Then use: `font-serif` for quotes, `font-sans` for everything else.

---

## Key Design Tokens

```
Page bg:          bg-stone-50  (neutral-50 / #fafaf9)
Body text:        text-stone-800
Muted text:       text-stone-400
Borders:          border-stone-200
Primary:          bg-indigo-600 / text-indigo-600
Primary hover:    bg-indigo-700
Saved icon:       text-amber-500
Card bg:          bg-white
Card border:      border border-stone-200
Card radius:      rounded-xl
Card padding:     p-6
Card shadow:      shadow-sm hover:shadow-md
```

---

## Phase Checklist

- [ ] Phase 1 — Scaffold + Supabase + Navbar + Auth context
- [ ] Phase 2 — Quote of the day (Edge Function + Home page)
- [ ] Phase 3 — Search page
- [ ] Phase 4 — Login page (Email + Google + GitHub)
- [ ] Phase 5 — Favourites (save/unsave + Favourites page)
- [ ] Phase 6 — Quote cards (ShareModal + 5 themes + download/share)
- [ ] Phase 7 — Chatbot (Edge Function + Chat page)
- [ ] Phase 8 — Profile page
- [ ] Phase 9 — Polish + deploy
