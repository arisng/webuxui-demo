# GitHub Copilot Instructions for webuxui-demo

## Project Overview
This repository contains interactive web UI demos showcasing modern web platform features, particularly Scoped View Transitions. Each demo is a standalone HTML/CSS/JS application focused on progressive enhancement and mobile-first design.

## Architecture
- **Demo Structure**: Each demo lives in `demos/<demo-name>/` with `index.html`, `styles.css`, `script.js`, and `README.md`.
- **Standalone Demos**: No shared dependencies; each demo is self-contained for easy testing and deployment.
- **Progressive Enhancement**: Core functionality works without modern APIs, enhanced with fallbacks.

## Development Workflow
- **Local Testing**: Run `python -m http.server 8000` from project root, open `http://localhost:8000/demos/<demo>/index.html` in Chrome.
- **Browser Setup**: Enable "Experimental Web Platform features" in `chrome://flags/#enable-experimental-web-platform-features` for latest APIs.
- **Version Control**: Use atomic commits with descriptive messages (e.g., "feat: add pull-to-refresh functionality").

## Code Patterns
- **HTML**: Use semantic elements, add `contain: layout;` to transition elements.
- **CSS**: Assign unique `view-transition-name` to scoped elements (e.g., `view-transition-name: post1-transition;`).
- **JavaScript**: Check API support with `HTMLElement.prototype.startViewTransition`, provide manual fallbacks using opacity transitions.
- **Animations**: Use `::view-transition-group()`, `::view-transition-old()`, `::view-transition-new()` for custom animations.
- **Mobile-First**: Design for touch, use flexbox for layouts.

## Examples
- Scoped transitions: `element.startViewTransition({ callback: () => { element.innerHTML = newContent; } });`
- Fallback: `manualTransition(element, () => { element.innerHTML = newContent; }, 600);`
- Key files: `demos/scoped-view-transitions/script.js` for transition logic, `styles.css` for animations.

## Testing
- Test in Chrome with experimental flags.
- Verify fallbacks work by disabling the flag.
- Check mobile responsiveness.