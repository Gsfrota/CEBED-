# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # Production build (outputs to dist/)
npm run deploy    # Build and deploy to GitHub Pages (branch gh-pages on Gsfrota/CEBED-)
```

No test suite is configured.

## Architecture

Single-page landing site for **CEBEDÊ**, a Brazilian medical cannabis association. The app is a pre-registration form that collects leads and stores them in Supabase.

### File layout

- `main-entry.jsx` — React DOM root mount; imports `main.jsx` as `App`
- `main.jsx` — **entire application in one file**: all UI components + Supabase client + form logic
- `supabase/functions/telegram-alert/index.ts` — Deno edge function triggered by a Supabase database webhook on INSERT; sends a Telegram message with the new lead's details
- `index.css` — global styles (Tailwind base)
- `tailwind.config.js` — scans `index.html`, `*.js`, `*.jsx` (root only, no subdirectories)

### Data flow

1. User fills the pre-registration form in `main.jsx`
2. On submit, the form inserts a row into the `pre_cadastros` Supabase table (fields: `nome`, `whatsapp`, `localizacao`, `prescricao`, `apoio_juridico`)
3. A Supabase database webhook fires `supabase/functions/telegram-alert`, which forwards the lead to a Telegram chat

### Key implementation details

- **Supabase client** is initialized at the top of `main.jsx` with the anon key hardcoded (no `.env` file)
- **Reusable animation components** defined in `main.jsx`: `Reveal` (scroll-triggered fade/slide via IntersectionObserver), `AnimatedCounter` (counting animation on scroll entry), `MouseGlow` (radial gradient following cursor)
- All content is in **Portuguese (pt-BR)**
- No router — single view, no navigation
- Deployment target: `https://www.xn--cebed-lsa.com/` (punycode for `cebedê.com`)
