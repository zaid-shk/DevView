# State Management Reference

DevView uses **Redux Toolkit** with two slices. All state is typed via JSDoc-style comments in the source.

---

## Store Configuration

**File:** `src/store/store.js`

```js
import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import screenReducer from './slices/screenSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,      // URL, zoom, scroll, history
    screen: screenReducer // device list and visibility
  }
});
```

The store is injected at the app root via `<Provider store={store}>` in `main.jsx`.

---

## `app` Slice

**File:** `src/store/slices/appSlice.js`

### State Shape

```ts
{
  activeUrl: string;       // URL currently loaded in all iframes
  syncScroll: boolean;     // Is synchronized scrolling active?
  reload: boolean;         // Toggled to force-reload all iframes
  zoomLevel: number;       // Dashboard zoom percentage (30–200)
  history: HistoryItem[];  // Recently previewed URLs
}

type HistoryItem = {
  url: string;
  timestamp: string;  // ISO 8601 date string
  id: string;         // Date.now() as string
}
```

### Actions

#### `setActiveUrl(url: string)`
Sets the URL that all iframes will load. Triggers a re-render of `Screens.jsx`, which resets all device loading and error states.

```js
dispatch(setActiveUrl('https://example.com'));
```

#### `setSyncScroll(enabled: boolean)`
Enables or disables the synchronized scroll feature across all iframes.

```js
dispatch(setSyncScroll(false));
```

#### `setReload(value: boolean)`
Toggling this value causes all iframes to remount (because the `key` prop changes). Used by the Reload button in `Control.jsx`.

```js
dispatch(setReload(!reload));
```

#### `incremented()` / `decremented()`
Increases or decreases `zoomLevel` by 10. Capped between 30 and 200.

```js
dispatch(incremented());
dispatch(decremented());
```

#### `addToHistory(url: string)`
Adds a URL to the history array. Deduplicates (removes existing entry first, then prepends). Caps at 50 items. Syncs to `localStorage`.

```js
dispatch(addToHistory('https://example.com'));
```

#### `removeFromHistory(id: string)`
Removes a single history item by its `id`. Syncs to `localStorage`.

```js
dispatch(removeFromHistory('1714471200000'));
```

#### `clearHistory()`
Empties the entire history array and removes `devview_history` from `localStorage`.

```js
dispatch(clearHistory());
```

---

## `screen` Slice

**File:** `src/store/slices/screenSlice.js`

### State Shape

```ts
{
  previewUrl: string;         // (currently unused)
  devices: Device[];          // Full registry of all devices
  visibleDeviceIds: string[]; // IDs of currently shown devices
}

type Device = {
  id: string;           // e.g. "mobile-m", "custom-1714471200000"
  name: string;         // Display label
  width: number;        // Real device width in pixels
  height: number;       // Real device height in pixels
  scale: number;        // Default scale factor (0.35–0.6)
  icon: 'smartphone' | 'tablet' | 'laptop' | 'monitor';
  category: 'mobile' | 'tablet' | 'desktop' | 'custom';
}
```

### Built-in Devices

| id | name | width | height |
|---|---|---|---|
| `mobile-m` | Mobile M | 375 | 667 |
| `mobile-l` | Mobile L | 425 | 926 |
| `tablet` | Tablet | 768 | 1024 |
| `laptop` | Laptop | 1024 | 768 |
| `desktop` | Desktop | 1440 | 900 |
| `desktop-l` | Desktop L | 1920 | 1080 |

**Default visible:** `mobile-m`, `tablet`, `desktop`

### Actions

#### `toggleDevice(deviceId: string)`
Shows or hides a device. Enforces a minimum of 1 visible device — if only one is visible, it cannot be hidden.

```js
dispatch(toggleDevice('tablet'));
```

#### `setVisibleDevices(ids: string[])`
Replaces the entire `visibleDeviceIds` array. Useful for preset configurations.

```js
dispatch(setVisibleDevices(['mobile-m', 'desktop']));
```

#### `addCustomDevice({ name, width, height })`
Creates a new device entry with a unique `custom-{timestamp}` ID and immediately adds it to `visibleDeviceIds`. The scale is auto-calculated:
- `width > 900` → scale `0.4`
- `width ≤ 900` → scale `0.6`

```js
dispatch(addCustomDevice({ name: 'My Phone', width: 390, height: 844 }));
```

---

## Reading State in Components

All components use `useSelector` from `react-redux`:

```js
// Reading app state
const activeUrl   = useSelector(state => state.app.activeUrl);
const syncScroll  = useSelector(state => state.app.syncScroll);
const zoomLevel   = useSelector(state => state.app.zoomLevel);
const history     = useSelector(state => state.app.history);

// Reading screen state
const allDevices        = useSelector(state => state.screen?.devices || []);
const visibleDeviceIds  = useSelector(state => state.screen?.visibleDeviceIds || []);
```

> The optional chaining (`state.screen?.devices`) guards against the unlikely case of the slice not being registered — important during development when hot-reloading can temporarily produce undefined slices.
