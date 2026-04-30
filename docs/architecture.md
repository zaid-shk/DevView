# Architecture Deep Dive

## Overview

DevView is a **single-page application (SPA)** built entirely on the client. There is no server-side rendering. All logic — URL resolution, device management, history, scroll sync — runs in the browser.

## Entry Point Flow

```
index.html
  └── src/main.jsx
        ├── <StrictMode>
        ├── <Provider store={store}>    ← Redux injected globally
        ├── <BrowserRouter>             ← React Router context
        └── <App />
              └── <Layout />
                    ├── Route "/"           → <LandingPage />
                    ├── Route "/dashboard"  → <Dashboard />
                    └── Route "/history"    → <HistoryPage />
```

## Data Flow

```
User types URL
  → URLBar resolves protocol (async fetch no-cors probe)
  → dispatch(setActiveUrl(url))
  → dispatch(addToHistory(url))
        ↓
  Redux appSlice.activeUrl updates
        ↓
  Screens.jsx re-renders (useSelector)
  → resets loadingStates + errorStates for all visibleDeviceIds
  → sets 10s timeout per device
        ↓
  Each SingleScreen gets new `activeUrl` prop
  → iframe key changes → iframe remounts → loads new URL
        ↓
  iframe fires onLoad
  → heuristic checks timing + contentWindow access
  → if blocked: errorStates[id] = true
  → if ok: clears skeleton, attaches scroll listener
```

## Component Ownership

| Concern | Owner |
|---|---|
| URL resolution logic | `URLBar.jsx` |
| Global URL state | `appSlice.activeUrl` |
| Device registry | `screenSlice.devices[]` |
| Which devices are shown | `screenSlice.visibleDeviceIds[]` |
| Per-device loading/error state | `Screens.jsx` local state |
| Scroll sync coordination | `Screens.jsx` (refs, not Redux) |
| Screenshot capture | `Control.jsx` |
| History CRUD | `appSlice` reducers |

> **Note on scroll sync using refs, not Redux:**
> Scroll events fire at ~60fps. Dispatching Redux actions at that rate would saturate the store and cause severe jank. Refs (`useRef`) are used instead because they mutate without triggering re-renders.

## State Persistence Layer

```
Redux Store (in-memory, session lifetime)
     ↕ sync on every mutation
localStorage (key: "devview_history")
```

The history array in Redux is initialized from `localStorage` on page load. Every `addToHistory`, `removeFromHistory`, and `clearHistory` action also writes back to `localStorage`. There is no debounce — writes are synchronous and immediate.

## Scaling Strategy

Iframes are rendered at their true device resolution, then CSS-transformed:

```
Outer container: width = device.width  * scale  (visual bounding box)
Inner iframe:    width = device.width            (true resolution)
                 transform: scale(scale)         (CSS shrinks it visually)
                 transformOrigin: 'top left'     (anchors scaling to top-left)
```

This avoids browser text-rendering artifacts that occur when you set an iframe's `width` to a small value — the iframe renders at full fidelity and is only *visually* shrunk.

## Build Pipeline

```
Vite 8 (dev server / bundler)
  ├── @vitejs/plugin-react        → Babel transforms JSX, Fast Refresh
  └── @tailwindcss/vite           → Tailwind v4 CSS processing (no PostCSS needed)
```

Tailwind v4 runs as a Vite plugin, scanning JSX files for class usage and generating atomic CSS at build time. The `@theme {}` block in `index.css` replaces `tailwind.config.js` entirely.
