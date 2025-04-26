# Lock In: Block Distractions. Unlock Focus.

![Lock In Icon](public/icon128.png)
[Available on the Chrome Web Store](https://chromewebstore.google.com/detail/lock-in-block-distraction/hchpbgikdjjaecnpjigpbemfpklenjbk)
A Chrome extension designed to help you block distractions, focus better, and stay on track effortlessly. Set your desired focus time and block distracting websites to maximize your productivity.

## Features

- **Customizable Timer:** Set focus sessions using hours, minutes, and seconds.
- **Visual Countdown:** Circular progress indicators visually represent the remaining time.
- **Website Blocking:** Add specific websites to a blocklist that will be inaccessible during focus sessions.
- **Dynamic Blocking Rules:** Uses Chrome's `declarativeNetRequest` API for efficient website blocking.
- **Session Completion Notification:** Get notified when your focus session ends.
- **Custom Block/Completion Pages:** Displays user-friendly pages when accessing blocked sites or completing a session.
- **Persistent Blocklist:** Your list of blocked websites is saved using `chrome.storage.sync`.
- **Session State Persistence:** Timer state (running time, status) is saved using `chrome.storage.session` to persist across popup closes.

## Technology Stack

- **Frontend:** React, TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS, Material Tailwind
- **Linting:** ESLint with TypeScript ESLint

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <your-repository-url>
    cd lock-in-extension/Lock-In
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

### Development

1.  Run the Vite development server:

    ```bash
    npm run dev
    ```

    This command watches for file changes and enables Hot Module Replacement (HMR). _Note: HMR might require manual reloading for some background script or content script changes._

2.  **Load the extension in Chrome (Development):**
    - Open Chrome and navigate to `chrome://extensions/`.
    - Enable "Developer mode" (usually a toggle in the top right corner).
    - Click "Load unpacked".
    - Select the `lock-in-extension/Lock-In` directory (the root of the project where `manifest.json` is located). _Vite handles the build process in memory during development._

### Building for Production

1.  Build the extension:

    ```bash
    npm run build
    ```

    This command compiles the TypeScript code, bundles the assets, and places the production-ready extension files in the `dist` directory.

2.  **Load the extension in Chrome (Production):**
    - Open Chrome and navigate to `chrome://extensions/`.
    - Enable "Developer mode".
    - Click "Load unpacked".
    - Select the `lock-in-extension/Lock-In/dist` directory.

## How to Use

1.  **Open the Extension:** Click the Lock In icon in your Chrome toolbar.
2.  **Set Focus Time:** Enter the desired hours, minutes, and/or seconds in the input fields.
3.  **(Optional) Block Sites:**
    - If the timer is not running, click the "Block Sites" button.
    - Enter the full URL of a website you want to block (e.g., `https://www.distracting-site.com/`) and click "Add".
    - Repeat for all sites you wish to block.
    - Click the back arrow to return to the timer view.
4.  **Start Session:** Click the "Start" button. The timer will begin, and the sites in your blocklist will become inaccessible.
5.  **Stop Session:** Click the "Stop" button at any time to end the session early and unblock websites.
6.  **Session End:** When the timer reaches zero, you'll receive a notification, blocked sites will be automatically unblocked, and a completion page may open.

## Linting

Run the linter to check for code style issues:

```bash
npm run lint
```
