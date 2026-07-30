# Harry Potter Fan Club

A companion web app for a Harry Potter fan club: new members take a Sorting Hat quiz to discover their Hogwarts house, then explore the Wizarding World (houses, spells, potions), with page views and key interactions instrumented in Amplitude.

Built for the Minders Solutions Architect Challenge.

## Features

- **Sorting Hat quiz**: assigns a house from name + email via a deterministic algorithm (same email always sorts into the same house).
- **Profile & identity**: once identified, the navbar's CTA becomes a house-crested profile avatar; opening it shows your house (linked back to its detail page) and an email, with a "Log out" that clears the locally saved profile so the next person on the same device can take their own Sorting Hat quiz and get their own house.
- **Deterministic user identity**: the Amplitude `user_id` is a SHA-256 hash of the normalized email, so the same person always resolves to the same user in Amplitude, regardless of device. Logging out clears the `user_id` (`setUserId(undefined)`) but doesn't rotate Amplitude's `device_id`; see [Low Level Diagram](diagrams/low-level.md) for how that plays into identity resolution when a device is shared.
- **House browsing**: list of all houses and a detail page per house (founder, heads of house, traits, common room).
- **Spellbook**: searchable, filterable list of spells with a "cast a random spell" shortcut.
- **Potions Cabinet**: searchable, filterable list of potions with ingredients and inventors.
- **Amplitude analytics**: page views on every route, plus 8 interaction events covering house browsing, the Sorting Hat flow, and profile/session actions (see [Analytics events](#analytics-events) below).

All four house/spell/potion resources above are fetched from the public, read-only [Wizard World API](https://wizard-world-api.herokuapp.com). There is no backend in this project by design: that API needs no auth or secrets to protect, and Amplitude's Browser SDK is instrumented entirely client-side.

## Tech stack

- **React 19 + Vite**: SPA, no server-side rendering.
- **React Router**: client-side routing (`/home`, `/allhouses`, `/houses/:slug`, `/spellbook`, `/potions`).
- **Amplitude Browser SDK** (`@amplitude/unified`): 100% client-side instrumentation.
- **TypeScript**, **Oxlint**.

## Architecture

- [High Level Diagram](diagrams/high-level.md): system-level view (SPA, Wizard World API, Amplitude, Browser Storage; no backend of our own).
- [Low Level Diagram](diagrams/low-level.md): sequence diagrams for the key runtime flows (house navigation, Sorting Hat identity lifecycle, returning visitor, shared device, Spellbook).

## Getting started

```bash
npm install
```

Create a `.env` file in the project root with your Amplitude API key:

```bash
VITE_AMPLITUDE_API_KEY=your_amplitude_api_key
# Optional, defaults to true. Set to false to develop without sending real events
VITE_AMPLITUDE_TRACKING_ENABLED=true
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

- `Page Viewed`: fired on every route change.
- `Discover Your House Clicked`
- `Sorting Hat Not Now Clicked`
- `Sorting Hat Form Submitted`
- `View House Clicked` (tagged with `source`: `home_card`, `nav_menu`, or `profile`)
- `Bio Viewed`
- `Cast Random Spell Clicked`
- `Profile Opened`
- `Logged Out`

## Deployed 
Vercel: https://harry-potter-fanclub.vercel.app

## Amplitude dashboard
[here](https://app.amplitude.com/analytics/share/11083c8f6de041e597301f11d011d2bd)

