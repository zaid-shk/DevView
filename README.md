# DevView — Frontend Documentation 🚀

> **A premium, high-performance responsive web design previewer built with React 19, Vite, Tailwind CSS v4, and Redux Toolkit.**

## 📚 Documentation

| Doc | Description |
|---|---|
| [Architecture](./docs/architecture.md) | System design, data flow, build pipeline |
| [State Management](./docs/state-management.md) | Redux slices, actions, state shapes |
| [Component API](./docs/components.md) | All components with props and behavior |
| [Features Guide](./docs/features.md) | User-facing features with internal details |

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Live Architecture Diagram](#2-live-architecture-diagram)
3. [Technology Stack (Deep Dive)](#3-technology-stack-deep-dive)
4. [Project Structure](#4-project-structure)
5. [Getting Started](#5-getting-started)
6. [Core Features — How They Work](#6-core-features--how-they-work)
   - [Smart URL Resolution](#61-smart-url-resolution)
   - [Multi-Device Previewing](#62-multi-device-previewing)
   - [Synchronized Scrolling Engine](#63-synchronized-scrolling-engine)
   - [iframe Blocking Heuristic & Error Detection](#64-iframe-blocking-heuristic--error-detection)
   - [Screenshot Engine](#65-screenshot-engine)
   - [Persistent URL History](#66-persistent-url-history)
   - [Custom Device Management](#67-custom-device-management)
   - [Zoom Control](#68-zoom-control)
7. [State Management — Redux Architecture](#7-state-management--redux-architecture)
   - [appSlice](#71-appslice)
   - [screenSlice](#72-screenslice)
8. [Component Reference](#8-component-reference)
9. [Routing](#9-routing)
10. [Styling System](#10-styling-system)
11. [Known Limitations & Browser Security Constraints](#11-known-limitations--browser-security-constraints)
12. [Scripts Reference](#12-scripts-reference)
13. [Contributing](#13-contributing)

---

## 1. Project Overview

**DevView** is a frontend-only responsive design previewing tool. It allows web developers to load any URL and instantly view how it renders across multiple device sizes — all in one dashboard. Devices appear side by side, simulated via CSS-scaled `<iframe>` elements sized to the exact pixel dimensions of real-world devices.

The project is entirely client-side. No backend is required for core functionality. A Node.js/Express backend exists in the repository for future API integrations (e.g., saved projects, user accounts) but is not required to run the previewer.

**Primary use cases:**
- Quickly testing responsiveness of a website across breakpoints
- Comparing layouts side by side before deployment
- Capturing a multi-device screenshot for presentations or reports
- Auditing third-party websites for cross-device consistency

---

## 2. Live Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                     │
│                                                         │
│  ┌───────────────┐   ┌───────────────────────────────┐  │
│  │  BrowserRouter│   │         Redux Store           │  │
│  │  (React Router│   │  ┌──────────┐  ┌────────────┐ │  │
│  │   v7)         │   │  │ appSlice │  │screenSlice │ │  │
│  └──────┬────────┘   │  └──────────┘  └────────────┘ │  │
│         │            └───────────────────────────────┘  │
│  ┌──────▼────────────────────────────────────────────┐  │
│  │                   Layout.jsx (Router)             │  │
│  │  /          →  LandingPage                        │  │
│  │  /dashboard →  Dashboard (Control + Screens)      │  │
│  │  /history   →  HistoryPage                        │  │
│  │  /devices   →  Device Manager Page                │  │
│  │  /settings  →  Settings & Appearance Page         │  │
│  │  /saved     →  Saved Projects Page                │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  Dashboard:                                             │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Navbar ── URLBar                                │   │
│  │  Control Bar (Zoom | SyncScroll | Reload |       │   │
│  │               Screenshot | History | Devices)    │   │
│  │  ┌──────────────────────────────────────────────┐│   │
│  │  │  Screens.jsx (orchestrator)                  ││   │
│  │  │ ┌────────────┐ ┌────────────┐ ┌────────────┐ ││   │
│  │  │ │SingleScreen│ │SingleScreen│ │SingleScreen│ ││   |
│  │  │ │ (iframe)   │ │ (iframe)   │ │ (iframe)   │ ││   │
│  │  │ └────────────┘ └────────────┘ └────────────┘ ││   │
│  │  └──────────────────────────────────────────────┘│   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack (Deep Dive)

| Technology | Version | Role |
|---|---|---|
| **React** | ^19.2.5 | UI rendering, component model |
| **Vite** | ^8.0.10 | Dev server, HMR, production bundler |
| **Tailwind CSS** | ^4.2.4 | Utility-first styling via `@tailwindcss/vite` plugin |
| **Redux Toolkit** | ^2.11.2 | Centralized state for URL, devices, history, scroll |
| **React Redux** | ^9.2.0 | React bindings for the Redux store |
| **React Router DOM** | ^7.14.2 | Client-side page routing |
| **dom-to-image-more** | ^3.7.2 | SVG ForeignObject-based DOM → PNG screenshot engine |
| **html2canvas** | ^1.4.1 | Fallback canvas-based screenshot library |
| **Lucide React** | ^1.11.0 | Icon library (tree-shakeable SVG icons) |
| **clsx** | ^2.1.1 | Conditional CSS class merging utility |
| **axios** | ^1.15.2 | HTTP client (available for future API use) |
| **react-hot-toast** | ^2.6.0 | Non-blocking toast notification system |

### Why Tailwind CSS v4?

Tailwind v4 replaces the legacy `tailwind.config.js` with a pure CSS-first configuration. The `@theme {}` block in `index.css` defines design tokens directly, and the Vite plugin (`@tailwindcss/vite`) replaces the PostCSS pipeline entirely. This results in **faster build times** and **no separate config file** to maintain.

### Why dom-to-image-more over html2canvas?

`html2canvas` re-renders the DOM onto a `<canvas>` element — it struggles with modern CSS features like `oklch()` colors, CSS Grid gaps, and `backdrop-filter`. `dom-to-image-more` serializes the DOM into an SVG `<foreignObject>` which preserves all CSS faithfully. DevView uses `dom-to-image-more` as the primary engine and bundles `html2canvas` as a fallback.

---

## 4. Project Structure

```
frontend/
├── index.html                  # Vite HTML entry — mounts #root
├── vite.config.js              # Vite + React + Tailwind plugin config
├── package.json                # Dependencies & npm scripts
├── eslint.config.js            # ESLint flat config (React hooks + refresh)
└── src/
    ├── main.jsx                # App root: Redux Provider + BrowserRouter
    ├── App.jsx                 # Renders <Layout /> (the route controller)
    ├── index.css               # Global CSS: Tailwind import, @theme, fonts
    ├── assets/
    │   └── fonts/              # Self-hosted Helvetica Now Display (woff2/woff/ttf)
    ├── components/             # Shared components (used across pages)
    │   ├── Navbar.jsx          # Top navigation bar
    │   └── URLBar.jsx          # Smart URL input with protocol detection
    ├── routing/
    │   └── Layout.jsx          # React Router <Routes> definition
    ├── landing/                # Landing page module
    │   ├── Page.jsx            # Landing page shell
    │   └── components/
    │       ├── Navbar.jsx      # Landing-specific navbar
    │       ├── Hero.jsx        # Hero section with CTA
    │       └── Footer.jsx      # Page footer
    ├── dashboard/              # Core application module
    │   ├── Page.jsx            # Dashboard shell (Navbar + URLBar + Control + Screens)
    │   ├── History.jsx         # /history page — browsing history manager
    │   ├── Devices.jsx         # /devices page — custom device presets manager
    │   ├── Settings.jsx        # /settings page — theme and app preferences
    │   ├── SavedProjects.jsx   # /saved page — bookmarked URLs and configurations
    │   └── components/
    │       ├── Control.jsx     # Control bar (zoom, sync, screenshot, devices, save)
    │       ├── Screens.jsx     # Renders all visible device iframes
    │       ├── SingleScreen.jsx# One device frame (iframe + skeleton + error UI)
    │       ├── EmptyState.jsx  # Illustrated empty state before URL is entered
    │       └── ScreenSkeleton.jsx # Animated loading skeleton for iframes
    └── store/
        ├── store.js            # configureStore — combines all reducers
        ├── index.js            # Re-exports store
        └── slices/
            ├── appSlice.js     # URL, syncScroll, zoom, reload, history state
            └── screenSlice.js  # Device list, visible devices, custom devices
```

---

## 5. Getting Started

### Prerequisites

- **Node.js** v18 or higher (`node --version`)
- **npm** v9+ or **bun** (both work; bun is faster)
- A modern browser (Chrome 115+, Firefox 110+, Safari 16+)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/zaid-shk/Portfolio-.git
cd DevView/frontend

# 2. Install dependencies
npm install
# or with bun (faster):
bun install
```

### Development Server

```bash
npm run dev
# Server starts at http://localhost:5173 by default
```

Vite's HMR (Hot Module Replacement) will update the browser instantly on any file save with **no full page reload**.

### Production Build

```bash
npm run build
# Output goes to /frontend/dist/
```

### Preview Production Build Locally

```bash
npm run preview
# Serves /dist on http://localhost:4173
```

### Linting

```bash
npm run lint
# Runs ESLint with React Hooks and React Refresh rules
```

---

## 6. Core Features — How They Work

### 6.1 Smart URL Resolution

**File:** `src/components/URLBar.jsx`

When the user types a URL without a protocol (e.g., `github.com`), the `URLBar` component uses a cascading protocol-prediction algorithm to find the correct URL before loading it into the iframes.

**Algorithm:**
1. If the URL already starts with `http://` or `https://`, use it directly.
2. If the URL contains `localhost` or matches an IP pattern (`0.0.0.0`), prepend `http://`.
3. Otherwise, test four permutations in order using `fetch` with `mode: 'no-cors'`:
   - `https://domain.com`
   - `https://www.domain.com`
   - `http://domain.com`
   - `http://www.domain.com`
4. The **first reachable** URL wins and is dispatched to Redux (`setActiveUrl`).
5. The UI shows a `"Checking..."` state while the probing runs.

> **Why `no-cors`?** This mode allows the `fetch()` call to succeed even when the server doesn't send CORS headers. It only tests reachability — the response body is opaque and cannot be read. This is purely a ping to determine if the domain resolves.

```js
// URLBar.jsx — core logic
const checkUrl = async (testUrl) => {
  try {
    await fetch(testUrl, { mode: "no-cors" });
    return true;
  } catch {
    return false; // DNS failure, SSL error, or unreachable
  }
};
```

---

### 6.2 Multi-Device Previewing

**Files:** `src/dashboard/components/Screens.jsx`, `SingleScreen.jsx`

Each device is rendered as a **CSS-scaled `<iframe>`** set to the device's real pixel dimensions.

**Built-in device presets** (defined in `screenSlice.js`):

| ID | Name | Width | Height | Category |
|---|---|---|---|---|
| `mobile-m` | Mobile M | 375px | 667px | mobile |
| `mobile-l` | Mobile L | 425px | 926px | mobile |
| `tablet` | Tablet | 768px | 1024px | tablet |
| `laptop` | Laptop | 1024px | 768px | desktop |
| `desktop` | Desktop | 1440px | 900px | desktop |
| `desktop-l` | Desktop L | 1920px | 1080px | desktop |

**Default visible:** `mobile-m`, `tablet`, `desktop`

**Scaling technique:** The iframe is rendered at its real size and then CSS-transformed:

```jsx
// SingleScreen.jsx — the scaling trick
<div style={{
  width: `${config.width}px`,
  height: `${config.height}px`,
  transform: `scale(${scale})`,       // shrinks the real-sized iframe
  transformOrigin: 'top left',
}}>
  <iframe src={activeUrl} className="w-full h-full" />
</div>
```

The **outer container** is sized to `width * scale` and `height * scale` — this collapses the visual bounding box so devices don't take up huge screen space. The iframe inside renders at full resolution, giving pixel-perfect accuracy.

The `scale` factor is: `0.35 * (zoomLevel / 100)`, allowing the user to zoom in/out via the Control bar.

**Independent loading states:** Each device (`screenId`) has its own entry in `loadingStates{}` and `errorStates{}` objects in `Screens.jsx`. Adding a new device does **not** trigger a reload on existing previews — only the new device starts in a loading state.

---

### 6.3 Synchronized Scrolling Engine

**File:** `src/dashboard/components/Screens.jsx`

When `syncScroll` is `true`, scrolling inside any iframe triggers proportional scrolling in all other visible iframes.

**How it works:**

1. After each iframe loads successfully, an event listener is attached to `iframe.contentWindow`:
   ```js
   iframe.contentWindow.addEventListener('scroll', () => handleScroll(screenId));
   ```
2. `handleScroll(sourceId)` reads the **scroll percentage** of the source iframe:
   ```js
   const scrollPercentY = scrollY / (scrollHeight - viewportHeight);
   ```
3. That percentage is applied to all other iframes:
   ```js
   targetIframe.contentWindow.scrollTo(
     targetIframe.contentWindow.scrollX,
     targetMaxScrollY * scrollPercentY
   );
   ```
4. A `scrollingScreen` ref prevents **feedback loops**: if iframe A triggered the scroll, only iframe A can propagate scrolls until 20ms of inactivity.

> **Cross-origin restriction:** This only works for same-origin content (e.g., `localhost`). For external sites, accessing `contentWindow` throws a `SecurityError` — this is caught silently and the feature degrades gracefully.

---

### 6.4 iframe Blocking Heuristic & Error Detection

**File:** `src/dashboard/components/Screens.jsx` — `handleIframeLoad()`

Since browsers cannot expose HTTP response headers (like `X-Frame-Options`) to JavaScript, DevView uses a **timing-based heuristic** to detect blocked iframes.

**The heuristic:**

```js
const loadTime = Date.now() - loadStartTimeRefs.current[screenId];

if (loadTime < 1500) {
  try {
    const href = iframe.contentWindow.location.href;
    if (!href || href === 'about:blank') return; // Still loading
  } catch (err) {
    // SecurityError thrown = cross-origin block detected
    setErrorStates(prev => ({ ...prev, [screenId]: true }));
    return;
  }
}
```

**Logic:**
- If the `onLoad` event fires in **under 1.5 seconds** AND accessing `contentWindow.location` throws a `SecurityError`, the iframe was almost certainly rejected by the browser (`X-Frame-Options: SAMEORIGIN` or `DENY`).
- Normal websites take longer than 1.5s to load, so a fast load + security error = blocked embed.

**10-second timeout fallback:**
```js
timeoutRefs.current[id] = setTimeout(() => {
  setLoadingStates(prev => ({ ...prev, [id]: false }));
  setErrorStates(prev => ({ ...prev, [id]: true }));
}, 10000);
```
If the iframe takes more than 10 seconds without triggering `onLoad`, it is marked as an error (network timeout or silent failure).

**The Error UI** in `SingleScreen.jsx` scales responsively with the device size:
```jsx
<h3 style={{ fontSize: `${Math.max(11, 17 * scale)}px` }}>
  This website cannot be loaded in preview
</h3>
```
This ensures readable text even on small-scaled device frames.

---

### 6.5 Screenshot Engine

**File:** `src/dashboard/components/Control.jsx` — `handleScreenshot()`

The screenshot captures the entire `#all-screens-container` div (which holds all device frames side by side) as a PNG.

```js
const dataUrl = await domtoimage.toPng(element, {
  bgcolor: '#0a0a0a',
  width: element.scrollWidth,    // full horizontal extent
  height: element.scrollHeight,  // full vertical extent
  style: {
    transform: 'none',
    padding: '40px'
  }
});
```

**Why `scrollWidth` / `scrollHeight`?** The container uses `min-w-max` to prevent wrapping. Its visual width may exceed the viewport, so `scrollWidth` captures the full canvas including off-screen content.

**Download trigger:**
```js
const link = document.createElement('a');
link.href = dataUrl;
link.download = `devview-responsive-${Date.now()}.png`;
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
```

**UX feedback:** `react-hot-toast` is used for three states:
- 🔄 Loading: `toast.loading("Generating screenshot...")`
- ✅ Success: `toast.success("Download started!")`
- ❌ Error: `toast.error("Capture failed...")`

> **Known limitation:** Cross-origin iframes render as blank areas in the screenshot. This is a browser security feature — canvas tainting prevents reading pixels from cross-origin frames. The screenshot still captures the device shells (labels, borders) accurately.

---

### 6.6 Persistent URL History

**Files:** `src/store/slices/appSlice.js`, `src/dashboard/History.jsx`

History is stored in both the **Redux store** (for live reactivity) and **`localStorage`** (for persistence across page refreshes).

**Initial state bootstraps from localStorage:**
```js
history: JSON.parse(localStorage.getItem('devview_history') || '[]')
```

**`addToHistory` reducer logic:**
1. Removes the URL if it already exists (to avoid duplicates).
2. Prepends it to the beginning of the array (`unshift`).
3. Caps the array at **50 items** (`pop()` removes the oldest).
4. Syncs the updated array back to `localStorage`.

**History item shape:**
```js
{
  url: "https://example.com",
  timestamp: "2026-04-30T10:00:00.000Z",
  id: "1714471200000"  // Date.now() as string
}
```

**History page features:**
- Formatted timestamps using `Intl.DateTimeFormat` (e.g., "Apr 30, 10:00 AM")
- Per-item deletion via `removeFromHistory(item.id)`
- Full history wipe via `clearHistory()` (also removes from `localStorage`)
- One-click re-preview: dispatches `setActiveUrl(url)` then navigates to `/dashboard`
- Hover-reveal action buttons (opacity transition) for a clean UI

---

### 6.7 Custom Device Management

**Files:** `src/dashboard/Devices.jsx`, `src/dashboard/components/Control.jsx`, `src/store/slices/screenSlice.js`

Users can define any custom screen size from the dedicated Device Manager page (`/devices`).

**Custom device form fields:**
- Device Name (text)
- Width in px (number)
- Height in px (number)
- Icon (smartphone, tablet, laptop, monitor)
- Category (mobile, tablet, desktop, custom)

**`addCustomDevice` reducer:**
```js
addCustomDevice: (state, action) => {
  const id = `custom-${Date.now()}`;
  const scale = width > 900 ? 0.4 : 0.6; // auto-scale heuristic
  const newDevice = { id, ...action.payload, scale };
  state.devices.push(newDevice);
  state.visibleDeviceIds.push(id); // immediately visible
}
```

**Toggle devices:** The `toggleDevice` reducer enforces a **minimum of 1 visible device** — you cannot hide all screens at once.

**Device Manager & Dropdown:** Lists all devices (built-in + custom) categorized neatly. Clicking toggles visibility via `dispatch(toggleDevice(device.id))`.

---

### 6.8 Saved Projects

**Files:** `src/dashboard/SavedProjects.jsx`, `src/store/slices/appSlice.js`

Users can bookmark their current testing configurations, capturing the active URL and the specific devices currently visible.

**Saving Flow:**
- Click "Save" in the `Control.jsx` bar.
- Provide an optional project name.
- Project is dispatched to Redux and persisted to `localStorage`.

**Saved Projects Page (`/saved`):**
- Displays a grid of project cards with device icons.
- One-click loading restores the exact `activeUrl` and `visibleDeviceIds`.
- Integrated search functionality to find projects quickly.

---

### 6.9 Zoom Control

**File:** `src/store/slices/appSlice.js`, `src/dashboard/components/Control.jsx`

The zoom level is a percentage stored in Redux (`zoomLevel`, default `100`).

```js
incremented: state => { if (state.zoomLevel < 200) state.zoomLevel += 10; },
decremented: state => { if (state.zoomLevel > 30)  state.zoomLevel -= 10; }
```

**Zoom range:** 30% — 200%, in 10% increments.

The `scale` passed to each `SingleScreen` is computed in `Screens.jsx`:
```js
const scale = 0.35 * (zoomLevel / 100);
```

At 100% zoom, devices render at `0.35x` their real size. At 200% zoom, they render at `0.70x`. At 30% zoom, they render at `0.105x`.

---

## 7. State Management — Redux Architecture

The Redux store is configured with two slices. The store is created in `src/store/store.js` and injected at the app root in `main.jsx` via `<Provider store={store}>`.

### 7.1 `appSlice`

**State shape:**
```js
{
  activeUrl: '',          // The URL currently loaded in all iframes
  syncScroll: true,       // Whether synchronized scrolling is enabled
  reload: false,          // Toggle to force-reload all iframes
  zoomLevel: 100,         // Current zoom percentage (30–200)
  history: [],            // Array of { url, timestamp, id } objects
  savedProjects: [],      // Array of { name, url, deviceIds, timestamp, id }
  theme: 'dark',          // Global theme mode ('light' | 'dark')
  showDeviceFrames: true, // Whether to show device name and dimensions
  enableAnimations: true  // Global animation toggle
}
```

**Actions exported:**
| Action | Payload | Effect |
|---|---|---|
| `setActiveUrl` | `string` | Sets the URL for all iframes |
| `setSyncScroll` | `boolean` | Toggles synchronized scrolling |
| `setReload` | `boolean` | Toggles the reload flag (iframes re-render) |
| `incremented` | — | Zoom +10 (max 200) |
| `decremented` | — | Zoom -10 (min 30) |
| `addToHistory` | `string` (url) | Adds URL to history, deduplicates, caps at 50 |
| `removeFromHistory` | `string` (id) | Removes item by id |
| `clearHistory` | — | Clears all history |
| `saveProject` | `object` | Bookmarks a URL and device configuration |
| `deleteProject` | `string` (id) | Removes a saved project |
| `setTheme` | `'light'\|'dark'` | Updates the global appearance |

### 7.2 `screenSlice`

**State shape:**
```js
{
  previewUrl: "",               // (unused — activeUrl in appSlice is used instead)
  devices: [ ...initialDevices ],    // Full device registry
  visibleDeviceIds: ["mobile-m", "tablet", "desktop"]
}
```

**Actions exported:**
| Action | Payload | Effect |
|---|---|---|
| `setPreviewUrl` | `string` | Sets previewUrl in this slice |
| `toggleDevice` | `string` (deviceId) | Shows/hides a device (min 1 always visible) |
| `setVisibleDevices` | `string[]` | Replaces visible IDs array entirely |
| `addCustomDevice` | `{name, width, height}` | Creates and immediately shows a new device |

---

## 8. Component Reference

### `Navbar.jsx` (shared)
Top bar with the DevView logo and navigation links. Two versions exist: one in `/components` (used in dashboard and history) and one in `/landing/components` (landing page).

### `URLBar.jsx`
Smart URL input field. Accepts any URL format. On submit, runs the 4-permutation protocol check asynchronously. Calls `onSubmit(url)` prop with the resolved URL.

**Props:** `{ onSubmit: (url: string) => void }`

### `Control.jsx`
The full dashboard control bar. Contains:
- Zoom (`−` / `+` buttons)
- Sync Scroll (animated toggle switch)
- Reload button (toggles `reload` in Redux)
- History / Saved Projects links
- Screenshot button (async, with loading state)
- Custom Device dropdown form
- Add Device dropdown with checkmarks

### `Screens.jsx`
The core orchestrator. Reads `visibleDeviceIds` from Redux and renders a `SingleScreen` for each. Manages:
- Per-device `loadingStates` and `errorStates`
- 10-second error timeout refs
- Iframe refs for scroll sync
- The `handleScroll`, `handleIframeLoad`, and `handleRetry` callbacks

### `SingleScreen.jsx`
Renders one device frame. Shows:
- Device icon + name + width label
- The `<iframe>` at real size, scaled via CSS transform
- `ScreenSkeleton` overlay while loading
- Error UI overlay when `isError` is true

**Props:**
```js
{
  screenId: string,
  config: { name, width, height, scale, icon },
  scale: number,
  isLoading: boolean,
  activeUrl: string,
  reload: string,         // key string to force iframe remount
  iframeRef: (el) => void,
  onIframeLoad: () => void,
  isError: boolean,
  onRetry: () => void
}
```

### `ScreenSkeleton.jsx`
An animated shimmer placeholder matching the device dimensions, displayed while the iframe is loading.

### `EmptyState.jsx`
The illustration shown before any URL is entered. Features decorative floating elements, an `AppWindow` icon, a `Search` badge, and a hand-drawn SVG arrow pointing upward toward the URL bar.

### `History.jsx` (page)
Full-page history manager at `/history`. Lists all stored history entries with timestamps. Shows an empty-state illustration when the history is empty.

### `SavedProjects.jsx` (page)
Dashboard for managing bookmarked URL and device configurations at `/saved`.

### `Devices.jsx` (page)
Comprehensive device manager at `/devices`. Allows creating custom device dimensions, adding predefined presets, filtering by category, and toggling visibility.

### `Settings.jsx` (page)
Preferences control center at `/settings`. Allows users to toggle between Light and Dark mode (`theme`), disable animations, and hide device header frames.

---

## 9. Routing

**File:** `src/routing/Layout.jsx`

DevView uses React Router DOM v7 with `<BrowserRouter>` wrapping the entire app.

```
Route: /            → <LandingPage />
Route: /dashboard   → <Dashboard /> (URLBar + Control + Screens)
Route: /history     → <HistoryPage />
Route: /devices     → <DevicesPage />
Route: /settings    → <SettingsPage />
Route: /saved       → <SavedProjectsPage />
```

Navigation between pages uses React Router's `<Link>` component and the `useNavigate()` hook — no hard page reloads.

---

## 10. Styling System

**File:** `src/index.css`

DevView uses **Tailwind CSS v4** configured directly in CSS using the `@import "tailwindcss"` directive. The design system is defined in a `@theme {}` block:

```css
@theme {
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif, ...;
}
```

**Typography:**
- **Inter** (Google Fonts) — primary UI font, weights 400–800
- **Helvetica Now Display Medium** — self-hosted via `@font-face`, used for display headings

**Color palette & Theme System:**
DevView features a comprehensive Light and Dark mode system driven by Redux state (`app.theme`).
- **Dark Mode (`'dark'`):** Zinc-based dark theme with amber/yellow (`#ffc53d`) accents. Base background `#0a0a0a`, with elevated surfaces at `#111113` and `#18181b`.
- **Light Mode (`'light'`):** Crisp, high-contrast light theme with blue (`#2563eb`) accents. Base background `bg-zinc-50`, with clean white `bg-white` panels and subtle `border-zinc-200` borders.

**Global Base Styles:**
```css
body {
  @apply bg-zinc-950 text-white font-sans antialiased;
}

/* Global Thin Scrollbars */
@layer base {
  * {
    scrollbar-width: thin;
    scrollbar-color: rgba(155, 155, 155, 0.5) transparent;
  }
}
```

**Conditional Theme Merging:**
Handled throughout components using `clsx` and ternaries:
```js
className={clsx(
    "base-class transition-colors duration-300",
    theme === 'light' ? "bg-white text-zinc-900" : "bg-zinc-900 text-white"
)}
```

---

## 11. Known Limitations & Browser Security Constraints

| Limitation | Cause | Behavior in DevView |
|---|---|---|
| Many popular sites can't be embedded | `X-Frame-Options: SAMEORIGIN` or `DENY` header | Custom error UI shown in that device frame |
| Scroll sync doesn't work on external sites | Cross-origin `contentWindow` access is blocked by the browser | Degrades silently; no crash |
| Screenshots have blank areas for blocked iframes | Canvas tainting from cross-origin content | Device shells still captured correctly |
| `no-cors` fetch doesn't validate SSL in all browsers | Browser vendor differences | May fall through to HTTPS fallback silently |
| History doesn't sync across tabs | Uses `localStorage`, not `BroadcastChannel` or server | Each tab maintains its own Redux state; localStorage loads on initial boot only |

---

## 12. Scripts Reference

| Command | Description |
|---|---|
| `npm run dev` | Start Vite development server with HMR at `localhost:5173` |
| `npm run build` | Production build output to `/dist` |
| `npm run preview` | Serve the production build locally at `localhost:4173` |
| `npm run lint` | Run ESLint across all `.jsx` / `.js` files |

---

## 13. Contributing

1. Fork the repository and create a feature branch: `git checkout -b feature/my-feature`
2. Follow the existing component patterns — keep each component focused on a single responsibility.
3. State changes always go through Redux — avoid local state for data that needs to be shared.
4. Test across Chrome, Firefox, and Safari — iframe behavior varies across browsers.
5. Submit a pull request with a clear description of your changes.

---

<div align="center">

Built with ❤️ for web developers by [Zaid Sheikh](https://github.com/zaid-shk)

**DevView** — *See every screen. Ship with confidence.*

</div>
