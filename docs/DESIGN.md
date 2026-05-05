# Quotidian — Design System

> Reference this whenever building any UI component.
> When in doubt: minimal, calm, literary.

---

## Brand

| Property   | Value                                              |
|------------|----------------------------------------------------|
| Name       | Quotidian                                          |
| Tagline    | *Your daily dose of wisdom*                        |
| Personality | Calm, minimal, literary, thoughtful. Not flashy.  |
| Feel       | Like a well-designed book or literary magazine     |

---

## Color Palette

### Base colors (use these in Tailwind classes)

```
Primary (indigo) — brand, buttons, links, active states
  primary-50  → #eef2ff   (very light tint, tag backgrounds)
  primary-100 → #e0e7ff
  primary-500 → #6366f1
  primary-600 → #4f46e5   (main button color)
  primary-700 → #4338ca   (button hover)
  primary-900 → #1e1b4b   (dark headings)

Neutral (warm gray) — text, backgrounds, borders
  neutral-50  → #fafaf9   (page background — off-white, never pure white)
  neutral-100 → #f5f5f4   (card hover background)
  neutral-200 → #e7e5e4   (borders, dividers)
  neutral-400 → #a8a29e   (muted text, placeholders)
  neutral-600 → #57534e   (secondary text)
  neutral-800 → #292524   (body text)
  neutral-900 → #1c1917   (headings)

Accent (warm amber) — save/heart icon when active
  accent-400 → #fbbf24
  accent-500 → #f59e0b

Semantic
  success → #10b981  (saved confirmation)
  error   → #ef4444  (error states)
```

### Usage rules
- Page background: always `neutral-50` (never pure white or gray-100)
- Body text: `neutral-800`
- Muted / secondary text: `neutral-400` or `neutral-600`
- Headings: `neutral-900`
- Primary action buttons: `primary-600` background, white text
- Links: `primary-600`, hover `primary-700`
- Active nav links: `primary-600`
- Saved/heart icon: `neutral-300` default → `accent-500` when saved

---

## Typography

### Font imports (add to index.html)
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

### Font usage

| Font   | Family                    | Used for                              |
|--------|---------------------------|---------------------------------------|
| Lora   | serif                     | All quote text — literary feel        |
| Inter  | sans-serif                | All UI — nav, buttons, labels, body   |

**Rule: every quote displayed anywhere uses Lora (serif).
Everything else uses Inter (sans-serif).**

### Type scale

| Name     | Size     | Weight | Font  | Tailwind class             |
|----------|----------|--------|-------|----------------------------|
| Display  | 2.25rem  | 400    | Serif | `text-4xl font-serif`      |
| H1       | 1.875rem | 600    | Sans  | `text-3xl font-semibold`   |
| H2       | 1.5rem   | 600    | Sans  | `text-2xl font-semibold`   |
| H3       | 1.125rem | 500    | Sans  | `text-lg font-medium`      |
| Body     | 1rem     | 400    | Sans  | `text-base`                |
| Small    | 0.875rem | 400    | Sans  | `text-sm`                  |
| Tiny     | 0.75rem  | 400    | Sans  | `text-xs`                  |

### Quote text specifically
- Font: Lora, italic variant for the quote body
- Non-italic for the author line
- Example: `font-serif italic text-xl leading-relaxed text-neutral-800`

---

## Spacing

Use Tailwind's default spacing scale (base 4px).
Stick to multiples: 4, 8, 12, 16, 24, 32, 48, 64px

Page container: `max-w-2xl mx-auto px-4`
This keeps content at a comfortable reading width (~672px max).

---

## Components

### Quote Card

Visual layout:
```
┌────────────────────────────────────────────┐
│                                            │
│  " The only way to do great work is       │  ← Lora italic, text-xl
│    to love what you do. "                 │
│                                            │
│    — Steve Jobs                            │  ← Inter, text-sm, neutral-500
│    Innovation  ·  Motivation              │  ← tag pills
│                                            │
│  [♡ Save]   [↓ Share]                     │  ← action buttons
└────────────────────────────────────────────┘
```

Tailwind classes for the card:
```
bg-white rounded-xl border border-neutral-200 p-6 shadow-sm
hover:shadow-md transition-shadow duration-200
```

- Quote text: `font-serif italic text-xl leading-relaxed text-neutral-800`
- Opening/closing `"` marks: large, decorative, `text-primary-200`
- Author line: `text-sm text-neutral-500 mt-4 not-italic`
- Author dash: `— Steve Jobs` (em dash, not hyphen)

### Tag Pills
```
bg-primary-50 text-primary-700 text-xs px-3 py-1 rounded-full
```

### Buttons

**Primary button:**
```
bg-primary-600 hover:bg-primary-700 text-white
text-sm font-medium px-4 py-2 rounded-lg
transition-colors duration-150
```

**Ghost / secondary button:**
```
border border-neutral-200 hover:bg-neutral-100 text-neutral-700
text-sm font-medium px-4 py-2 rounded-lg
transition-colors duration-150
```

**Icon button (save):**
```
p-2 rounded-lg hover:bg-neutral-100 transition-colors
text-neutral-400 hover:text-accent-500
```
When saved: `text-accent-500` (amber heart icon)

**Share / action button (small):**
```
flex items-center gap-1.5 text-sm text-neutral-500
hover:text-neutral-800 transition-colors
```

### Navbar
```
Height: 60px
Background: white
Border bottom: border-b border-neutral-200
Position: sticky top-0 z-50
```

Contents:
- Left: "Quotidian" wordmark in `font-serif text-xl text-neutral-900`
- Right: nav links + login button (or avatar if logged in)
- Mobile: hamburger icon → slide-in drawer from right

Nav links: `text-sm font-medium text-neutral-600 hover:text-primary-600`
Active link: `text-primary-600`

### Search Input
```
w-full h-11 px-4 pl-10 rounded-lg
border border-neutral-200 focus:border-primary-500
bg-white outline-none text-neutral-800 placeholder-neutral-400
text-sm transition-colors
```
Search icon (magnifying glass) positioned inside left side.

### Chatbot UI

Chat window background: `bg-neutral-50`

User message bubble:
```
bg-primary-600 text-white rounded-2xl rounded-br-sm
px-4 py-2.5 max-w-xs ml-auto text-sm
```

Bot message bubble:
```
bg-white border border-neutral-200 text-neutral-800
rounded-2xl rounded-bl-sm px-4 py-2.5 max-w-sm text-sm
```

Input bar: same style as search input, stuck to bottom of chat window.

### Login Page
```
Centered card: max-w-sm mx-auto mt-16
Card: bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm
```

Layout order:
1. "Welcome back" heading + subtext
2. Google button (full width, white bg, Google icon)
3. GitHub button (full width, dark bg, GitHub icon)
4. Divider: `── or continue with email ──`
5. Email input
6. Password input
7. Primary submit button
8. "Don't have an account? Sign up" toggle

Social login buttons should look like real Google/GitHub buttons
(use their official brand colors and icons).

---

## Quote Card Themes (for image download)

These are the 5 themes users can pick from in the share modal.
Each is a fixed 1080×1080px canvas (square, Instagram-friendly).

### Theme 1 — Minimal Light
```
Background: #fafaf9  (warm white)
Quote text: #1c1917  (neutral-900), Lora italic, ~40px
Author text: #57534e (neutral-600), Inter, ~24px
Decorative element: large faint quotation mark, neutral-200
```

### Theme 2 — Minimal Dark
```
Background: #1c1917  (neutral-900)
Quote text: #fafaf9  (neutral-50), Lora italic, ~40px
Author text: #a8a29e (neutral-400), Inter, ~24px
Decorative element: large faint quotation mark, neutral-800
```

### Theme 3 — Gradient Sunset
```
Background: linear gradient 135deg, #f97316 → #ec4899 → #8b5cf6
  (orange → pink → purple)
Quote text: white, Lora italic, ~40px, with subtle text-shadow
Author text: rgba(255,255,255,0.8), Inter, ~24px
```

### Theme 4 — Gradient Ocean
```
Background: linear gradient 135deg, #0ea5e9 → #6366f1
  (sky blue → indigo)
Quote text: white, Lora italic, ~40px
Author text: rgba(255,255,255,0.8), Inter, ~24px
```

### Theme 5 — Gradient Forest
```
Background: linear gradient 135deg, #10b981 → #0891b2
  (emerald → cyan)
Quote text: white, Lora italic, ~40px
Author text: rgba(255,255,255,0.8), Inter, ~24px
```

All themes:
- Fixed size: 1080×1080px (or 1080×1350 portrait option)
- Quote text centered horizontally, vertically centered with author
- Generous padding: ~80px all sides
- No logo, no website name, no watermark
- Max ~200 characters before text size reduces automatically

---

## Loading States

Use skeleton screens, not spinners.

Quote card skeleton:
```
Animated pulse blocks:
- 3 lines of text (90%, 80%, 60% width)
- 1 shorter line for author
- 2 small pill-shaped blocks for tags
```

Tailwind: `animate-pulse bg-neutral-200 rounded`

---

## Responsive Breakpoints

| Breakpoint | Width  | Changes                               |
|------------|--------|---------------------------------------|
| Mobile     | <640px | Single column, hamburger nav, full-width cards |
| Tablet     | 640px+ | Same as mobile but more padding       |
| Desktop    | 768px+ | Max-width container kicks in          |

The app is primarily designed for mobile reading but looks great on desktop.
