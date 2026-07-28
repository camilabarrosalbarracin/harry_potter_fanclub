# Harry Potter Fan Club

A companion web app for a Harry Potter fan club: new members take a Sorting Hat quiz to discover their Hogwarts house, then explore the Wizarding World — houses, spells, potions — with every interaction instrumented in Amplitude.

Built for the Minders Solutions Architect Challenge.

## Features

- **Sorting Hat quiz** — assigns a house from name + email via a deterministic algorithm (same email always sorts into the same house).
- **Profile & identity** — once identified, the navbar's CTA becomes a house-crested profile avatar; opening it shows your house (linked back to its detail page) and an email, with a "Log out" that clears the local profile so a second person on the same device can be sorted independently.
- **Deterministic user identity** — the Amplitude `user_id` is a SHA-256 hash of the normalized email, so the same person always resolves to the same user in Amplitude, regardless of device.
- **House browsing** — list of all houses and a detail page per house (founder, heads of house, traits, common room), consuming the [Wizard World API](https://wizard-world-api.herokuapp.com).
- **Spellbook** — searchable, filterable list of spells with a "cast a random spell" shortcut.
- **Potions Cabinet** — searchable, filterable list of potions with ingredients and inventors.
- **Amplitude analytics** — page views across every route, plus interaction events for clicks and the Sorting Hat form submit.

There is no backend in this project by design — the Wizard World API is public/read-only, and Amplitude's Browser SDK is instrumented entirely client-side.

## Tech stack

- **React 19 + Vite** — SPA, no server-side rendering.
- **React Router** — client-side routing (`/home`, `/allhouses`, `/houses/:slug`, `/spellbook`, `/potions`).
- **Amplitude Browser SDK** (`@amplitude/unified`) — 100% client-side instrumentation.
- **TypeScript**, **Oxlint**.

## Getting started

```bash
npm install
```

Create a `.env` file in the project root with your Amplitude API key:

```bash
VITE_AMPLITUDE_API_KEY=your_amplitude_api_key
```

Then:

```bash
npm run dev       # start the dev server
npm run build     # type-check + production build
npm run lint      # oxlint
npm run preview   # preview a production build locally
```

## Routes

| Path | Page |
|---|---|
| `/` | Redirects to `/home` |
| `/home` | Landing page |
| `/allhouses` | All houses + "Discover your house" |
| `/houses/:slug` | House detail |
| `/spellbook` | Spellbook |
| `/potions` | Potions Cabinet |

## Analytics events

All defined in `src/utils/analytics.ts`:

- `Page Viewed` — fired on every route change.
- `Discover Your House Clicked`
- `Sorting Hat Not Now Clicked`
- `Sorting Hat Form Submitted`
- `View House Clicked` (tagged with `source`: `home_card`, `nav_menu`, or `profile`)
- `Bio Viewed`
- `Cast Random Spell Clicked`
- `Profile Opened`
- `Logged Out`
