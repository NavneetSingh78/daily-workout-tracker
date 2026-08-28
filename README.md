# Daily Meditation & Workout Tracker

A responsive Next.js + React app for tracking daily meditation sessions and yoga/workout exercises. All data is stored locally in the browser (`localStorage`) — no account, no backend.

## Features

- **Meditation timer** — configurable session length, start/pause/reset, with synthesized ambient background sounds (calm drone, white noise, ocean waves, singing bowl, om chanting) generated in-browser via the Web Audio API — no external audio files.
- **Workout/yoga log** — quickly log exercises with sets, reps, and weight.
- **Daily history** — a running log of every day's meditation minutes and exercises, with per-day delete.
- **Stats** — current day streak, total sessions, and total minutes meditated.
- **Responsive design** — single-column on mobile, two-column layout on larger screens.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + React + TypeScript
- Tailwind CSS
- Web Audio API for ambient sound synthesis
- Browser `localStorage` for persistence

## Project structure

```
src/
  app/                  # App Router entry (layout, page, global styles)
  components/           # MeditationCard, WorkoutCard, HistoryCard, StatsRow
  hooks/useTrackerData.ts  # localStorage-backed state for meditation/workout data
  lib/
    types.ts            # Shared data types
    storage.ts          # localStorage load/save + date helpers
    soundEngine.ts       # Synthesized ambient sound engine
```

## Build

```bash
npm run build
npm start
```
