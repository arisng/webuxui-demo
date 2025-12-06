# Scoped View Transitions Demo

This demo showcases the Scoped View Transitions API, a new CSS feature in Chrome 140+ that allows for simultaneous, isolated animations within specific DOM subtrees.

## Features

- **Scoped Transitions**: Each section (nav, sidebar, content) has its own transition scope.
- **Simultaneous Animations**: Multiple transitions can run at the same time without interfering.
- **CSS-Powered**: Animations are handled via CSS for performance.
- **Progressive Enhancement**: Falls back to manual opacity transitions if the API is not supported.

## Setup

1. Enable "Experimental Web Platform features" in Chrome via `chrome://flags/#enable-experimental-web-platform-features`.
2. Open `index.html` in Chrome.
3. If the API is not supported, the demo will use fallback animations with alerts.

## Usage

- Click "Update Nav" to transition the navigation menu.
- Click "Update Sidebar" to transition the sidebar content.
- Click "Update Content" to transition the main content.
- Click "Update All" to trigger all transitions simultaneously.

## Browser Support

- Chrome 140+ (experimental)
- Not supported in other browsers yet.

## Files

- `index.html`: Demo page structure
- `styles.css`: CSS styles and transition animations
- `script.js`: JavaScript to trigger transitions

## Related Links

- [Scoped View Transitions Explainer](https://github.com/WICG/view-transitions/blob/main/scoped-transitions.md)
- [View Transitions API Docs](https://developer.chrome.com/docs/web-platform/view-transitions)
