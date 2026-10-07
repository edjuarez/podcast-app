# 🎙️ Podcast App

React + TypeScript podcast SPA built as a frontend technical test.

The application consumes the public Apple Podcasts API and RSS feeds, with client-side routing, local caching and a responsive interface.

The main goal was not only to implement the required features, but also to keep the application structure simple, maintainable and easy to reason about.

---

## 📚 Contents

1. ✨ [Features](#-features)
2. 🛠️ [Tech Stack](#️-tech-stack)
3. 📁 [Project Structure](#-project-structure)
4. 🏗️ [Architecture](#️-architecture)
5. 🪝 [Custom Hooks](#-custom-hooks)
6. 🎨 [Design Decisions](#-design-decisions)
   * 🧭 [Client-side Routing](#-client-side-routing)
   * 🔎 [Filtering](#-filtering)
   * 📝 [Podcast Description](#-podcast-description)
   * 📄 [Episode Descriptions](#-episode-descriptions)
   * ⏳ [Loading Indicator](#-loading-indicator)
   * 🔄 [API Response Mapping](#-api-response-mapping)
   * ⚠️ [Error Handling](#️-error-handling)
   * 📊 [Episode List Semantics](#-episode-list-semantics)
   * 🧪 [Testing Strategy](#-testing-strategy)
7. 💾 [Caching Strategy](#-caching-strategy)
8. 🌐 [Data Flow & API](#-data-flow--api)
9. ♿ [Accessibility](#-accessibility)
10. 📦 [Development](#-development)
11. 🏭 [Production](#-production)
12. 🧪 [Tests](#-tests)
13. 🚀 [Deployment](#-deployment)
14. 🔎 [Trade-offs & Possible Improvements](#-trade-offs--possible-improvements)
15. 📚 [Data Sources](#-data-sources)
16. 👤 [Author](#-author)


## ✨ Features

* 🎧 Top 100 podcasts from the Apple Podcasts RSS JSON endpoint
* 🔎 Instant filtering by podcast title or author
* 📖 Podcast detail view with artwork, title, author, description and episode list
* 🎵 Episode detail view with podcast information and native HTML5 audio player
* 📝 Episode descriptions rendered as HTML
* 💾 24-hour client-side cache using `localStorage`
* ⏳ Loading indicator displayed in the header during navigation and data loading
* ♿ Accessibility considerations based on WCAG 2.1 AA
* 🚀 Client-side navigation with clean URLs and no full page reload

---

## 🛠️ Tech Stack

* **React 19** — UI library
* **TypeScript** — static typing
* **Vite 8** — development server and build tool
* **React Router 7** — client-side routing
* **Tailwind CSS 4** — styling
* **Vitest** — testing framework
* **MSW** — network request mocking
* **Apple Podcasts API** — podcast and episode data
* **AllOrigins** — fallback for RSS feeds that do not allow direct cross-origin requests

### Why this stack?

I chose technologies that fit the size and requirements of the application without introducing unnecessary infrastructure or dependencies.

For example, I used Vite instead of setting up a custom Webpack configuration because the application does not need a complex build pipeline. Vite provides a simple development experience while still producing optimized production builds.

I also chose React because the exercise is specifically focused on building a frontend SPA, and React Router provides the client-side routing needed by the application without introducing another routing abstraction.

---

## 📁 Project Structure

```text
src/
├── components/   Reusable UI components
├── views/        Route-level components
├── hooks/        Data and shared state hooks
├── services/     API access, response mapping and caching
├── types/        Application domain types
├── test/         Test infrastructure, fixtures and MSW handlers
├── App.tsx       Application layout and route shell
├── main.tsx      Application entry point and router setup
└── index.css     Global styles
```

The structure is intentionally simple. Each layer has a specific responsibility instead of introducing additional abstraction for its own sake.

---

## 🏗️ Architecture

The application follows a small layered architecture:

```text
main.tsx / App.tsx
        ↓
      views/
        ↓
      hooks/
        ↓
    services/
        ↓
       API
```

### Responsibilities

**`views/`**

Route-level components. They decide which data and components are needed to render each page, but do not communicate directly with the API.

**`hooks/`**

Handle the lifecycle of asynchronous data and shared loading state. They expose the information that the views need without making the views responsible for the request implementation.

**`services/`**

The only layer responsible for API requests, response mapping and caching. This keeps external API details away from the UI.

**`components/`**

Reusable and mostly presentational components. They receive data through typed props and do not access services directly.

**`types/`**

Contains the application's own domain models such as `Podcast`, `Episode` and `PodcastDetail`.

### Data flow

A typical request follows this flow:

```text
View
 ↓
Custom Hook
 ↓
Service
 ↓
API / Cache
 ↓
API response mapping
 ↓
Hook state
 ↓
View
```

I chose this separation because I did not want API calls and external data structures spread throughout the UI. If the Apple API changes, the service layer is the main place that needs to adapt.

The raw Apple response types are therefore kept inside the service layer and mapped into the application's own models before the data reaches the views.

---

## 🪝 Custom Hooks

The custom hooks connect the views with the data and shared loading state while keeping the implementation details outside the UI components.

### `useTopPodcasts`

Loads the Top 100 podcasts and exposes the resulting data, loading state and error state to `HomeView`.

The view does not need to know how the request is made or how the data is cached.

### `usePodcastDetail`

Loads the podcast details and exposes the data, loading state and error state to the detail views.

Keeping this logic inside the hook prevents the views from having to repeat request and `useEffect` logic.

### `useReportViewLoading`

Allows a routed view to report when it starts and finishes loading.

This is needed because the loading indicator is rendered in the header, while the actual data loading happens inside the routed view.

Each view reports its loading state to the `LoadingProvider`, which keeps track of the active loading states.

### `useViewLoading`

Provides access to the shared loading state through the `LoadingProvider`.

The `NavigationIndicator` uses this hook to determine whether it should be visible in the header.

The relationship is:

```text
Routed View
     ↓
useReportViewLoading
     ↓
LoadingProvider
     ↓
useViewLoading
     ↓
NavigationIndicator
     ↓
Header
```

This keeps the header independent from the individual views while still allowing it to react to their loading state.

---

# 🎨 Design Decisions

This section explains not only what was implemented, but why I chose each approach and what alternatives I considered.

## 🧭 Client-side routing

**Decision:** Use `createBrowserRouter` with browser history.

The exercise requires client-side navigation, clean URLs and no hash routing.

I chose browser history because it produces regular URLs such as:

```text
/podcast/123
/podcast/123/episode/456
```

instead of hash-based URLs such as:

```text
/#/podcast/123
```

I considered `HashRouter`, but it would not satisfy the clean URL requirement.

For deployment, Vercel rewrites unknown paths to `index.html`, which allows direct navigation and page refreshes on nested routes.

---

## 🔎 Filtering

**Decision:** Filter the already loaded podcasts locally using `Array.filter()`.

The application only loads 100 podcasts, so there is no practical reason to make another request or introduce more complex state management just for filtering.

The filter checks both the podcast title and author and normalizes the values so that the search is case-insensitive.

I considered debouncing and server-side filtering, but those approaches would add complexity without providing a meaningful benefit for such a small dataset.

---

## 📝 Podcast description

**Decision:** Retrieve the long podcast description from the RSS feed.

The Apple Lookup API does not provide the description in the format required by the application, so the podcast's `feedUrl` is used to retrieve the RSS feed.

The service first tries the feed directly. If the browser blocks the request because of CORS, it falls back to AllOrigins.

I chose not to always use the proxy because some feeds already allow direct cross-origin requests. Using the proxy only when necessary avoids an unnecessary third-party request in those cases.

The extracted description is also stored together with the podcast detail in the cache, so repeat visits do not require another RSS request while the cache is valid.

---

## 📄 Episode descriptions

**Decision:** Render the RSS description using `dangerouslySetInnerHTML`.

The RSS feed contains formatted HTML and the requirement is to render that formatting rather than display the markup as plain text.

Rendering it as escaped text would be safer but would not meet the requirement.

This is therefore a deliberate trade-off based on the source of the content and the requirements of the exercise.

---

## ⏳ Loading indicator

**Decision:** Use `LoadingProvider` and React Context.

The loading state originates inside routed views, but the visual indicator is rendered in the header. These components are therefore in different parts of the component tree.

Context provides a simple way for the header to access the shared state without passing props through unrelated components.

I considered Redux and Zustand, but both would introduce unnecessary complexity for this particular use case. The application only needs a small piece of shared UI state, so Context is enough.

I also chose not to hide the indicator immediately after the route changes. A route transition can happen before the destination view has finished loading its data.

The indicator therefore stays visible until the destination view has finished loading the data it needs.

---

## 🔄 API response mapping

**Decision:** Map Apple API responses into application-specific domain models.

The UI should not need to know how Apple's API structures its response.

The raw API types remain inside the service layer and are transformed into models such as `Podcast`, `Episode` and `PodcastDetail`.

I chose this approach because it keeps external API concerns isolated. If the API response changes, the service can adapt without requiring components throughout the application to change.

---

## ⚠️ Error handling

**Decision:** Report errors through the console instead of displaying an error UI.

This follows the requirements of the exercise.

Errors are kept as real `Error` objects as they move through the service and hook layers. The views then log them with `console.error(error)`, preserving the message and stack trace.

I did not introduce a global error notification or error screen because the exercise explicitly requires console-based error reporting.

---

## 📊 Episode list semantics

**Decision:** Use a native HTML `<table>`.

Episodes naturally form tabular data, with columns such as title, date and duration.

I considered using `<div>` elements styled as a table, but a native `<table>` already provides the correct semantic structure for assistive technologies.

The table also uses `scope` attributes so screen readers can correctly associate headers with their rows and columns.

---

## 🧪 Testing strategy

**Decision:** Use Vitest and MSW.

I chose Vitest because it integrates naturally with the Vite setup and requires little additional configuration.

MSW intercepts HTTP requests at the network layer. This allows the application to behave as if it were communicating with the real API without coupling the production code to test-specific mocks.

I also use fake timers for cache tests so the 24-hour expiration boundary can be tested deterministically.

The current tests focus on the service layer and the main application flows. Direct testing of the custom hooks would be a useful area to expand in a larger test suite.

---

# 💾 Caching Strategy

The application uses `localStorage` with a 24-hour TTL.

| Data             | Key                                      | Stored value          |
| ---------------- | ---------------------------------------- | --------------------- |
| Top 100 podcasts | `podcast-app:top-podcasts`               | `{ timestamp, data }` |
| Podcast detail   | `podcast-app:podcast-detail:{podcastId}` | `{ timestamp, data }` |

The idea is simple: before making a request, the service checks whether valid data is already stored locally.

If the data is less than 24 hours old, it is returned immediately.

If it is missing or expired, the API is requested again and the new result replaces the old cache entry.

### Why `localStorage`?

I chose `localStorage` because the requirement is to reuse the data across page reloads and browser sessions.

`sessionStorage` would not be enough because its data is tied to the browser session.

I also considered using React Query or SWR, but for this application the caching requirements are relatively simple and there are only a few resources to manage. Adding a dedicated data-fetching library would introduce more abstraction than was necessary for the exercise.

### Cache flow

```text
Request
  ↓
Check localStorage
  ↓
Valid cache?
 ┌───────────────┐
 │ Yes           │ No
 ↓               ↓
Return cache    Fetch API
                 ↓
              Store data
                 ↓
              Return data
```

Cache writes are protected with `try/catch` so that a full `localStorage` quota does not break the application.

One possible improvement would be to use a single cache entry for podcast details instead of one key per podcast. This would make cache management and invalidation easier and reduce the number of `localStorage` entries.

---

# 🌐 Data Flow & API

| Purpose                      | Endpoint                                                                |
| ---------------------------- | ----------------------------------------------------------------------- |
| Top 100 podcasts             | `https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json` |
| Podcast details and episodes | `https://itunes.apple.com/lookup`                                       |
| RSS CORS fallback            | `https://api.allorigins.win/raw`                                        |

No API key or backend proxy is required.

### Data processing

The Apple responses are mapped inside `podcastService.ts` into the application's domain models.

The raw API structures do not leave the service layer.

For podcast descriptions, the service retrieves the RSS feed using the `feedUrl`, parses it with `DOMParser`, and extracts the relevant `summary` or `description`.

Some feeds do not allow direct browser requests because of CORS. In those cases, the service falls back to AllOrigins.

The extracted description is included in the podcast detail cache, so it does not require another request on subsequent visits while the cache is valid.

---

# ♿ Accessibility

I decided to include accessibility as part of the project because it is an important part of building a good web application, not something that should only be considered at the end. I wanted the application to be usable by people with different needs and interaction methods, while also following the WCAG 2.1 AA requirements defined for the exercise.

The UI was built with WCAG 2.1 AA considerations in mind, using native HTML semantics wherever possible and keeping ARIA usage to a minimum.

* **Semantic HTML:** Uses `header`, `main`, `aside`, `section`, `article`, `table`, native form controls and React Router `Link`.
* **Landmarks:** Views provide the appropriate page landmarks, with the header acting as the banner and the sidebar as complementary content.
* **Headings:** The home view includes an accessible `h1` without affecting the visual card layout.
* **Episode table:** Uses `scope="col"` and `scope="row"` to provide row and column context to screen readers.
* **Filter input:** Has an accessible name through `aria-label`.
* **Focus visibility:** Interactive elements maintain visible focus states.
* **Images:** Decorative artwork uses an empty `alt` when the adjacent text already provides the accessible name.
* **Loading indicator:** The navigation indicator is part of the header region so its state is available to assistive technology.

---

# 📦 Development

Requires Node.js `^20.19.0` or `>=22.12.0`.

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

### Lint

```bash
npm run lint
```

### Type checking

```bash
npx tsc --noEmit
```

This checks the TypeScript project without generating JavaScript files.

---

# 🏭 Production

### Build

```bash
npm run build
```

### Preview the production build locally

```bash
npm run preview
```

---

# 🧪 Tests

Run the test suite once:

```bash
npm run test
```

Watch mode:

```bash
npm run test:watch
```

Coverage:

```bash
npm run test:coverage
```

The tests cover the main application flows and service layer, including API requests, response mapping and cache expiration.

The coverage configuration uses the V8 provider with a minimum threshold of 70%, focused primarily on `services/` and `views/`.

---

# 🚀 Deployment

The application is deployed on Vercel:

https://podcast-app-edujuarezcba.vercel.app/

Vercel handles the SPA deployment configuration through `vercel.json`, rewriting application routes to `index.html`.

This allows direct navigation and page refreshes on routes such as:

```text
/podcast/123
/podcast/123/episode/456
```

without returning a 404.

---

# 🔎 Trade-offs & Possible Improvements

The implementation meets the requirements of the exercise, but there are a few areas I would approach differently or extend in a larger production application.

### Testing custom hooks

The current tests cover the main flows and service layer. The custom hooks could have more direct tests for their loading, success and error states.

### Cache structure

Podcast details are currently stored under individual `localStorage` keys. A shared cache structure could make invalidation and cache management easier.

### Cache resilience

Corrupted `localStorage` data could be handled explicitly as a cache miss, allowing the application to recover by requesting fresh data instead of relying on the stored value.

### Styling approach

Tailwind CSS was chosen for this implementation because it allowed the UI to be developed consistently without introducing a larger styling architecture. In a project where CSS architecture itself was a major requirement, CSS Modules or another approach could be considered depending on the team's needs.

### Deployment portability

The application could also include a Dockerfile to make the production environment easier to reproduce across different infrastructures.

These are improvements rather than requirements for the current implementation.

---

# 📚 Data Sources

The application uses public Apple Podcasts data and podcast RSS feeds.

* **Top podcasts:** Apple Podcasts RSS feed
* **Podcast and episode data:** Apple Podcasts Lookup API
* **Podcast descriptions:** Podcast RSS feeds
* **RSS CORS fallback:** AllOrigins

No API key or backend service is required.

---

# 👤 Author

**Eduardo Juárez**
