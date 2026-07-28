# Harry Potter Fan Club

A companion web app for a Harry Potter fan club: new members take a Sorting Hat quiz to discover their Hogwarts house, then browse all four houses — traits, founders, heads of house — with every interaction instrumented in Amplitude.

Built for the Minders Solutions Architect Challenge.

## Features

- **Sorting Hat quiz** — assigns a house from name + email via a deterministic algorithm (same email always sorts into the same house).
- **Deterministic user identity** — the Amplitude `user_id` is a SHA-256 hash of the normalized email, so the same person always resolves to the same user in Amplitude, regardless of device.
- **House browsing** — list of all houses and a detail page per house (founder, heads of house, traits, common room), consuming the [Wizard World API](https://wizard-world-api.herokuapp.com).
- **Spellbook** and **Potions Cabinet** — searchable/filterable browsing of spells and potions from the same API.
- **Amplitude analytics** — full page-view coverage plus 5 interaction events (clicks + form submit).

## Tech stack

- **React 19 + Vite** — SPA, no server-side rendering.
- **React Router** — client-side routing (`/home`, `/allhouses`, `/houses/:slug`, `/spellbook`, `/potions`).
- **Amplitude Browser SDK** (`@amplitude/unified`) — 100% client-side instrumentation, no backend.
- **TypeScript**, **Oxlint**.

There is no backend in this project by design.

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
