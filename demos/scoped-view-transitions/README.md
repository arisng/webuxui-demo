# Mobile Scoped View Transitions Demo

This demo showcases Scoped View Transitions in a realistic mobile social media feed scenario, highlighting simultaneous, isolated animations for individual posts and navigation.

## Features

- **Mobile-First Design**: Responsive layout optimized for mobile devices with touch-friendly interactions.
- **Social Feed Simulation**: Mock social media posts that update independently with scoped transitions.
- **Individual Post Updates**: Each post card transitions uniquely when interacted with (like, comment, share).
- **Bottom Navigation**: Tab switching with smooth scoped transitions.
- **Simultaneous Isolation**: Multiple posts can update at the same time without interference.
- **Progressive Enhancement**: Falls back to manual opacity fades if the API is not supported.

## Setup

1. Enable "Experimental Web Platform features" in Chrome via `chrome://flags/#enable-experimental-web-platform-features`.
2. Open `index.html` in Chrome.
3. If the API is not supported, the demo will use fallback animations with alerts.

## Usage

- **Post Interactions**: Click "Like +1", "Comment", or "Share" on each post to see individual scoped transitions updating the content.
- **Navigation**: Tap bottom nav items (Home, Search, Profile) to switch tabs with smooth transitions.
- **Auto-Update**: The header updates automatically after 2 seconds to demonstrate background transitions.

## Real-Life Use Cases

- **Social Media Feeds**: Updating like counts, comments, or shares on individual posts.
- **News Apps**: Refreshing article cards with new data.
- **Messaging Apps**: Updating conversation threads or status indicators.
- **E-commerce**: Product cards updating prices or availability.
- **Dashboard Apps**: Real-time data updates in widgets.

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
