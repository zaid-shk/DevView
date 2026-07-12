# Component API Reference

All components live under `src/`. Components are organized by feature module.

---

## Shared Components (`src/components/`)

### `Navbar`

Top navigation bar used in the Dashboard and History pages.

**File:** `src/components/Navbar.jsx`  
**Props:** None  
**State:** None (reads from Redux if needed via `useSelector`)

Renders the DevView wordmark and navigation links. Uses `<Link>` from `react-router-dom` for client-side navigation.

---

### `URLBar`

Smart URL input field with automatic protocol detection.

**File:** `src/components/URLBar.jsx`

**Props:**

| Prop | Type | Required | Description |
|---|---|---|---|
| `onSubmit` | `(url: string) => void` | ✅ | Called with the resolved URL when user submits |

**Behavior:**
1. User types a URL and presses `Enter` or clicks "Preview"
2. If URL has a protocol → passed through directly
3. If `localhost` or IP → `http://` prepended
4. Otherwise → async probe tests 4 permutations, uses first reachable URL
5. Shows `"Checking..."` text during async probe

**Internal state:**
- `url: string` — controlled input value
- `isChecking: boolean` — disables input during async probe

---

## Dashboard Components (`src/dashboard/components/`)

### `Control`

The full dashboard control bar with all interactive controls.

**File:** `src/dashboard/components/Control.jsx`  
**Props:** None  
**Redux reads:** `syncScroll`, `reload`, `zoomLevel`, `allDevices`, `visibleDeviceIds`  
**Redux writes:** `setSyncScroll`, `setReload`, `incremented`, `decremented`, `toggleDevice`, `addCustomDevice`

**Sections rendered:**

| Section | Description |
|---|---|
| Zoom | `−` / `+` buttons dispatching `decremented` / `incremented` |
| Sync Scroll | Animated toggle switch, dispatches `setSyncScroll` |
| Reload | Button dispatching `setReload(!reload)` |
| History | `<Link to="/history">` — navigates to history page |
| Saved Projects | Button (placeholder, future feature) |
| Screenshot | Async capture via `dom-to-image-more` |
| Custom Device | Dropdown form to add custom dimensions |
| Add Device | Dropdown listing all devices with toggle checkmarks |

**Local state:**
- `isScreenshotLoading: boolean` — disables screenshot button during capture
- `isDeviceMenuOpen: boolean` — controls device dropdown visibility
- `isCustomMenuOpen: boolean` — controls custom device form visibility
- `customName, customWidth, customHeight: string` — custom device form values

**Click-outside behavior:** Two `useRef` refs (`dropdownRef`, `customDropdownRef`) are attached to each dropdown. A `mousedown` listener on `document` closes open dropdowns when clicking elsewhere.

---

### `Screens`

The core orchestrator component. Renders all visible device previews.

**File:** `src/dashboard/components/Screens.jsx`  
**Props:** None  
**Redux reads:** `activeUrl`, `syncScroll`, `reload`, `zoomLevel`, `visibleDeviceIds`, `allDevices`

**Renders:** `<EmptyState />` if no URL, otherwise a `<SingleScreen />` per visible device.

**Internal state:**
```js
loadingStates: { [deviceId]: boolean }   // true = iframe is loading
errorStates:   { [deviceId]: boolean }   // true = iframe blocked/failed
localReloadKeys: { [deviceId]: number }  // incremented to retry individual screens
```

**Refs (not state — avoids re-renders):**
```js
iframeRefs:       { [deviceId]: HTMLIFrameElement }  // direct iframe DOM refs
scrollingScreen:  string | null                       // which device is driving scroll
scrollTimeouts:   { [deviceId]: TimeoutId }           // debounce timers for scroll
syncScrollRef:    boolean                             // mirror of syncScroll for use in event handlers
loadStartTimeRefs: { [deviceId]: number }             // timestamp when loading started
timeoutRefs:      { [deviceId]: TimeoutId }           // 10s error timeout per device
```

**Key methods:**

`handleIframeLoad(screenId)` — Called when an iframe fires `onLoad`. Implements the CORS-blocking heuristic. If `loadTime < 1500ms` and accessing `contentWindow.location` throws a `SecurityError`, marks device as error. Otherwise clears skeleton and attaches scroll listener.

`handleScroll(sourceId)` — Calculates scroll percentage of source iframe and applies proportional scroll to all other iframes. Silently fails on cross-origin frames.

`handleRetry(screenId)` — Resets the error state for a single device, increments its `localReloadKey` (causes iframe remount), and restarts the 10s timeout.

---

### `SingleScreen`

Renders one device frame: the scaled iframe, loading skeleton, and error overlay.

**File:** `src/dashboard/components/SingleScreen.jsx`

**Props:**

| Prop | Type | Description |
|---|---|---|
| `screenId` | `string` | Device identifier |
| `config` | `Device` | Device config object from Redux |
| `scale` | `number` | CSS scale factor |
| `isLoading` | `boolean` | Shows skeleton when true |
| `activeUrl` | `string` | URL to load in iframe |
| `reload` | `string` | Combined key string; changing causes iframe remount |
| `iframeRef` | `(el) => void` | Ref callback to capture iframe DOM node |
| `onIframeLoad` | `() => void` | Callback for iframe `onLoad` event |
| `isError` | `boolean` | Shows error UI overlay when true |
| `onRetry` | `() => void` | Called when user clicks "Retry" |

**Render layers (stacked absolutely):**
1. `<iframe>` at real device size, CSS-scaled — `opacity: 0` while loading
2. `<ScreenSkeleton>` — shown while `isLoading && !isError`
3. Error overlay — shown when `isError` is true

**Error UI scaling:** Font sizes scale with the device's visual size using `Math.max(minSize, targetSize * scale)` — prevents text from becoming unreadable on small scaled devices.

---

### `ScreenSkeleton`

Animated shimmer placeholder displayed while an iframe loads.

**File:** `src/dashboard/components/ScreenSkeleton.jsx`

**Props:**

| Prop | Type | Description |
|---|---|---|
| `width` | `number` | Real device width (for container sizing) |
| `height` | `number` | Real device height (for container sizing) |
| `scale` | `number` | CSS scale factor |

---

### `EmptyState`

Illustrated empty state shown when no URL has been entered.

**File:** `src/dashboard/components/EmptyState.jsx`  
**Props:** None

Features:
- `AppWindow` icon with a `Search` badge (Lucide React)
- Decorative floating dot/diamond elements
- Animated hand-drawn SVG arrow pointing toward the URL bar
- Prompt text: "Enter a URL to start previewing"

---

## Dashboard Pages (`src/dashboard/`)

### `History` (page)

Full history management page at `/history`.

**File:** `src/dashboard/History.jsx`  
**Redux reads:** `state.app.history`  
**Redux writes:** `setActiveUrl`, `removeFromHistory`, `clearHistory`

**Features:**
- Lists all history items with formatted timestamps (`Intl.DateTimeFormat`)
- Hover-reveal action buttons (opacity transition on `.group:hover`)
- "Preview" button → dispatches `setActiveUrl` + navigates to `/dashboard`
- "Delete" button → dispatches `removeFromHistory(item.id)`
- "Clear All" button → dispatches `clearHistory()`
- Empty state illustration when no history exists

---

## Landing Components (`src/landing/components/`)

### `Hero`
Hero section with headline, subtext, and CTA button linking to `/dashboard`.

### `Navbar` (landing)
Landing-specific navigation bar.

### `Footer`
Page footer with links and branding.
