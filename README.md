# DevView 🚀

**DevView** is a premium, high-performance responsive web design previewer. It allows developers to view their websites across multiple device sizes simultaneously, featuring synchronized scrolling, live previews, and high-resolution screenshot capabilities.

![DevView Banner](https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=2000)

## ✨ Features

-   **Multi-Device Sync**: Preview your site on Mobile, Tablet, Laptop, and Desktop screens at once.
*   **Synchronized Scrolling**: Scroll on one device, and all other screens follow perfectly (restricted by CORS for external sites).
*   **High-Res Screenshots**: Capture your entire responsive dashboard as a high-quality PNG with a single click.
*   **Persistent History**: Automatically keeps track of recently visited URLs using LocalStorage.
*   **Custom Devices**: Add your own custom screen dimensions to test specific device requirements.
*   **Smart URL Handling**: Predicts protocols (http/https) and checks availability automatically.
*   **Premium UI**: Dark mode dashboard with glassmorphism effects and smooth micro-animations.

## 🛠️ Technology Stack

-   **Frontend**: React 19, Vite, Tailwind CSS v4
-   **State Management**: Redux Toolkit
-   **Icons**: Lucide React
-   **Screenshot Engine**: Dom-to-image-more (SVG ForeignObject rendering)
-   **Animations**: Framer Motion (integrated for smooth transitions)
-   **Backend**: Node.js / Express (for future API integrations)

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18+)
-   npm or bun

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/zaid-shk/Portfolio-.git
    cd DevView
    ```

2.  **Install Frontend Dependencies**:
    ```bash
    cd frontend
    npm install
    ```

3.  **Install Backend Dependencies**:
    ```bash
    cd ../backend
    npm install
    ```

### Running the Project

1.  **Start the Frontend**:
    ```bash
    cd frontend
    npm run dev
    ```

2.  **Start the Backend** (if needed):
    ```bash
    cd ../backend
    npm start
    ```

## 📖 Documentation

### Dashboard Controls

-   **URL Bar**: Enter any URL (e.g., `google.com`) and hit Enter. DevView will try to find the correct protocol and load the site.
-   **Add Device**: Use the "Add Device" dropdown to toggle specific screen sizes on or off.
-   **Custom Device**: Click "Custom Device" to enter specific width and height values.
-   **Zoom**: Adjust the dashboard zoom level (30% to 200%) to fit more screens in your view.
-   **Sync Scroll**: Toggle whether scrolling on one device should mirror to others.
-   **Screenshot**: Click the Camera icon to generate a combined capture of all active screens.

### History Management

DevView stores your last 50 visits in the browser's LocalStorage. Access them via the **History** button in the control panel. From the history page, you can:
-   Quickly re-preview any site.
-   Remove individual items.
-   Clear your entire browsing history.

### Error Handling

DevView includes a custom heuristic to detect **X-Frame-Options** and **CORS** blocking. If a website refuses to be embedded, a premium error UI will appear instead of a blank frame.

## ⚠️ Important Note on Iframes

Some websites (like Google, YouTube, Facebook) explicitly block embedding via `X-Frame-Options: SAMEORIGIN` or `DENY`. DevView detects these and shows a custom error message. Additionally, cross-origin security prevents synchronized scrolling and screenshots from capturing the pixels of these protected third-party websites.

## 📄 License

This project is open-source. See the LICENSE file for details.

---
Built with ❤️ for web developers.
