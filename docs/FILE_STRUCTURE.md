# Quotidian — File Structure

```
quotidian/
│
├── public/
│   └── favicon.ico
│
├── src/
│   │
│   ├── main.jsx                    # App entry point
│   ├── App.jsx                     # Router setup, all routes defined here
│   │
│   ├── lib/
│   │   ├── supabase.js             # Supabase client (initialized once, imported everywhere)
│   │   └── utils.js                # Shared helper functions (date formatting, text truncation, etc.)
│   │
│   ├── context/
│   │   └── AuthContext.jsx         # React context: current user, login, logout, loading state
│   │
│   ├── hooks/
│   │   ├── useAuth.js              # Returns { user, loading } from AuthContext
│   │   ├── useDailyQuote.js        # Fetches quote from Quotable API, caches in localStorage
│   │   ├── useSavedQuotes.js       # Fetch, save, unsave quotes for current user
│   │   └── useSearch.js            # Search logic, debouncing, results state
│   │
│   ├── pages/
│   │   ├── Home.jsx                # Quote of the day page
│   │   ├── Search.jsx              # Search input + results grid
│   │   ├── Chat.jsx                # Chatbot page
│   │   ├── Favourites.jsx          # Saved quotes grid (protected)
│   │   ├── Login.jsx               # Login + signup page
│   │   └── Profile.jsx             # User profile + personal random quote (protected)
│   │
│   ├── components/
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar.jsx          # Top navigation bar
│   │   │   ├── MobileDrawer.jsx    # Slide-in nav drawer for mobile
│   │   │   └── ProtectedRoute.jsx  # Wrapper: redirects to /login if not authenticated
│   │   │
│   │   ├── quote/
│   │   │   ├── QuoteCard.jsx       # Main quote display card (used everywhere)
│   │   │   ├── QuoteCardSkeleton.jsx  # Loading skeleton for QuoteCard
│   │   │   ├── SaveButton.jsx      # Heart/save icon button with saved state
│   │   │   └── TagPill.jsx         # Small pill for quote tags
│   │   │
│   │   ├── card/
│   │   │   ├── ShareModal.jsx      # Modal: theme picker + card preview + share actions
│   │   │   ├── CardPreview.jsx     # The actual rendered card div (what html-to-image captures)
│   │   │   └── cardThemes.js       # Theme definitions (colors, fonts, styles) for all 5 themes
│   │   │
│   │   ├── chat/
│   │   │   ├── ChatWindow.jsx      # Scrollable message history
│   │   │   ├── ChatMessage.jsx     # Single message bubble (user or bot)
│   │   │   └── ChatInput.jsx       # Input bar at the bottom of chat
│   │   │
│   │   ├── auth/
│   │   │   ├── SocialLoginButton.jsx  # Reusable Google / GitHub login button
│   │   │   └── AuthDivider.jsx        # The "── or continue with email ──" divider
│   │   │
│   │   └── ui/
│   │       ├── Button.jsx          # Reusable button (primary, ghost, icon variants)
│   │       ├── Input.jsx           # Reusable text input
│   │       ├── Modal.jsx           # Generic modal wrapper with backdrop
│   │       ├── Spinner.jsx         # Loading spinner (used sparingly)
│   │       └── EmptyState.jsx      # "Nothing here yet" illustration + message
│   │
│   └── styles/
│       └── index.css               # Tailwind imports + any global CSS overrides
│
├── supabase/
│   └── functions/
│       ├── search-quotes/
│       │   └── index.ts            # Edge Function: proxy Quotable search
│       └── chat/
│           └── index.ts            # Edge Function: proxy messages to Gemini API
│
├── .env                            # Local env vars (never commit this)
├── .env.example                    # Safe template to commit (no real values)
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

---

## Key File Responsibilities

### `src/lib/supabase.js`
Creates and exports the single Supabase client instance.
Every file that needs Supabase imports from here.
```js
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

### `src/context/AuthContext.jsx`
Wraps the entire app. Listens to `supabase.auth.onAuthStateChange`.
Provides `{ user, loading, signOut }` to any component via `useAuth()` hook.

### `src/components/layout/ProtectedRoute.jsx`
Wraps pages that need auth. If `user` is null, redirects to `/login`.
If still loading auth state, shows a spinner. Otherwise renders the page.

### `src/components/quote/QuoteCard.jsx`
The most reused component in the app.
Props: `{ quote, author, tags, sourceId, showSave, showShare }`
Used on: Home, Search results, Favourites page.

### `src/components/card/CardPreview.jsx`
A `div` styled exactly like the final card image.
`html-to-image` targets this div's ref to generate the PNG.
Receives `{ quote, author, theme }` as props.

### `src/components/card/cardThemes.js`
An object/array defining all 5 themes with their CSS properties.
`ShareModal` reads from this to render the theme picker.

### `supabase/functions/chat/index.ts`
The only file that touches the Gemini API key.
Receives `{ messages }` from frontend, adds the system prompt,
calls Gemini, returns the response. Never exposes the API key.

---

## .env.example

```
# Copy this file to .env and fill in your values
# Never commit .env to git

VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## .gitignore additions
```
.env
.env.local
node_modules/
dist/
```
