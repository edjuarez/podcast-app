# Podcast App

React + TypeScript podcast SPA built as a frontend technical test. It consumes the Apple Podcasts (iTunes) API with client-side routing, 24 hour client-side caching and a responsive UI.

## Tech Stack

* React 19
* TypeScript
* Vite 8
* Tailwind CSS
* React Router
* Apple Podcasts API

## Features

* Top 100 podcasts from the Apple Top Podcasts RSS JSON endpoint.
* Instant filtering by title or author.
* Podcast detail view with a sidebar (artwork, title, author, description) and an episode list showing title, date and duration.
* Episode detail view with the podcast sidebar and a native HTML5 audio player.
* Episode descriptions are rendered as HTML instead of escaped markup.
* 24 hour client-side cache for both the Top 100 feed and every podcast detail, backed by `localStorage`.
* Visual loading indicator in the header while a route transition is pending.
* Accessibility: landmarks, a real table for the episode list, an accessible name for the filter input and visible focus indicators.

## Routes

| Route | View |
| --- | --- |
| `/` | Top podcasts with filtering |
| `/podcast/:podcastId` | Podcast detail with episode list |
| `/podcast/:podcastId/episode/:episodeId` | Episode detail with audio player |

Navigation is client-side, uses clean URLs and never reloads the document.

## Project Structure

```text
src/
├── components/   reusable UI: cards, episode list, sidebar, header, filter
├── views/        route level components
├── hooks/        data loading hooks
├── services/     API access and caching
├── types/        shared domain types
├── App.tsx       layout, header and route change announcements
├── main.tsx      router setup
└── index.css     global styles
```


## Development

Requires Node.js `^20.19.0` or `>=22.12.0`, which is the minimum enforced by Vite 8.

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Run ESLint:

```bash
npm run lint
```

Type-check without emitting files:

```bash
npx tsc --noEmit
```

## Production

Build for production:

```bash
npm run build
```

This runs `tsc -b` and then bundles with Vite, emitting minified, concatenated assets into `dist/`.

Preview the production build locally:

```bash
npm run preview
```

### Deployment

The application is deployed on Vercel:

https://podcast-app-edujuarezcba.vercel.app/

Vercel handles the SPA routing and deployment configuration.

## Data Sources

The application uses the public Apple Podcasts API and podcast RSS feeds. No API key or backend proxy is required.

Top podcasts: Apple Podcasts RSS Feed
Podcast and episode data: Apple Podcasts Lookup API
Podcast descriptions: podcast RSS feed

API responses are cached in localStorage for 24 hours to reduce unnecessary requests. Clearing the site's local storage forces the application to fetch fresh data.

## Bonus and Extras

### Accessibility

The UI was reviewed against WCAG 2.1 AA guidelines, with attention to semantic HTML, keyboard navigation, focus states, accessible labels, screen reader announcements, and responsive reflow.

ARIA is kept minimal by relying on native HTML semantics wherever possible and using aria-* attributes only when necessary.

### Testing

Vitest unit tests were added for `src/services/podcastService.ts`, covering API response mapping, the 24 hour cache and error handling. Network calls are mocked with MSW so the suite runs without hitting the real API.

## Author

**Eduardo Juárez**