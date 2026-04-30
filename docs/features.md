# Features Guide

A detailed walkthrough of every user-facing feature in DevView, including how to use it and how it works internally.

---

## URL Input & Smart Protocol Detection

### How to use
Type any URL into the address bar at the top of the dashboard and press `Enter` or click **Preview**.

### Supported formats
| Input | Resolved to |
|---|---|
| `example.com` | `https://example.com` (if reachable) |
| `www.example.com` | `https://www.example.com` |
| `https://example.com` | `https://example.com` (used directly) |
| `localhost:3000` | `http://localhost:3000` |
| `192.168.1.1` | `http://192.168.1.1` |

### What happens internally
If no protocol is specified, the app runs up to 4 reachability probes using `fetch` in `no-cors` mode. The first URL that responds without a network error is used.

---

## Multi-Device Preview

### How to use
Once a URL is entered, it loads across all active device frames simultaneously. By default, **Mobile M (375px)**, **Tablet (768px)**, and **Desktop (1440px)** are shown.

### Device presets
| Device | Viewport | Use case |
|---|---|---|
| Mobile M | 375×667 | iPhone SE, older Android phones |
| Mobile L | 425×926 | iPhone Pro Max, Galaxy S series |
| Tablet | 768×1024 | iPad, Android tablets |
| Laptop | 1024×768 | Small laptops, older screens |
| Desktop | 1440×900 | Standard desktop monitors |
| Desktop L | 1920×1080 | Full HD / 1080p displays |

> You cannot hide all devices at once. At least one must remain visible.

---

## Custom Devices

Click **Custom Device** in the control bar. Fill in a name, width, and height. The custom screen appears immediately and is toggled on by default.

**Notes:**
- Custom devices are stored in Redux only — they **do not persist** across page refreshes.
- Auto-scale: devices wider than 900px use scale `0.4`; others use `0.6`.

---

## Zoom Control

Use the **−** and **+** buttons to resize all device frames simultaneously.

| Zoom Level | Effect |
|---|---|
| 30% | Very small — fit many devices on one screen |
| 100% | Default — balanced view |
| 200% | Large — detailed inspection |

Scale formula: `0.35 × (zoomLevel / 100)`

---

## Synchronized Scrolling

The **Sync Scroll** toggle in the control bar (amber = on by default) links scrolling across all device previews by **scroll percentage**, not pixel offset.

**Example:** Scrolling to 50% on Mobile scrolls all other devices to their own 50% position.

**Limitation:** Only works for same-origin content (e.g., `localhost`). External sites block cross-origin `contentWindow` access — sync scroll silently does nothing.

---

## Reload

Clicks the **Reload** button to remount all iframes simultaneously, re-fetching the current URL.

---

## Screenshot Capture

Click the **Screenshot** button (camera icon). A PNG file downloads automatically named `devview-responsive-{timestamp}.png`.

**Captures:** The full horizontal spread of all visible device frames, labels, borders, and background.

**Limitation:** Cross-origin iframes render as blank rectangles due to browser canvas tainting. This is a security constraint that cannot be bypassed from the frontend.

**Toast feedback:**

| State | Toast |
|---|---|
| Capturing | 🔄 "Generating screenshot..." |
| Done | ✅ "Download started!" |
| Failed | ❌ "Capture failed..." |

---

## URL History

Every previewed URL is automatically saved. Click **History** in the control bar to open the history page.

**From the history page:**
- **Preview** — click "Preview" on any item to reload it in the dashboard
- **Delete** — hover and click the trash icon to remove one item
- **Clear All** — wipe the entire history

**Storage details:**
- Stored in `localStorage` under key `devview_history`
- Maximum **50 items** (oldest auto-removed)
- No duplicates — revisiting a URL moves it to the top
- Persists across browser sessions but is per-browser (not cloud-synced)

---

## Error Handling for Blocked Websites

Many sites block iframe embedding via HTTP headers (`X-Frame-Options`, `Content-Security-Policy`). DevView uses a timing-based heuristic to detect this:

1. If `onLoad` fires in **under 1.5 seconds**
2. AND `iframe.contentWindow.location` throws a `SecurityError`

→ The site is blocked. A custom error UI appears in that device frame with a **Retry** button.

If no `onLoad` fires within **10 seconds**, the iframe is also marked as an error (timeout / network failure).
