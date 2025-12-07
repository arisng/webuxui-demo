# WebUX UI Demo

A collection of interactive web UI demonstrations showcasing cutting-edge web platform features, with a focus on progressive enhancement, mobile-first design, and modern CSS/JavaScript APIs.

## Features

- **Scoped View Transitions**: Smooth, scoped animations for UI state changes
- **Progressive Enhancement**: Core functionality works without modern APIs, enhanced with fallbacks
- **Mobile-First Design**: Optimized for touch interactions and responsive layouts
- **Standalone Demos**: Each demo is self-contained with no shared dependencies

## Demo Structure

Each demo resides in its own directory under `demos/`:

```text
demos/
  <demo-name>/
    index.html      # Main HTML file
    styles.css      # CSS styles and animations
    script.js       # JavaScript logic and API interactions
    README.md       # Demo-specific documentation
```

## Getting Started

1. **Clone the repository**:

   ```bash
   git clone https://github.com/arisng/webuxui-demo.git
   cd webuxui-demo
   ```

2. **Start a local server**:

   ```bash
   python -m http.server 8000
   ```

3. **Open in browser**:
   Navigate to `http://localhost:8000/demos/<demo-name>/index.html`

## Browser Requirements

- **Chrome 140+** with experimental web platform features enabled:
  - Go to `chrome://flags/#enable-experimental-web-platform-features`
  - Set to "Enabled"
  - Restart browser

- **Fallback Support**: Demos work in other modern browsers with graceful degradation

## Development

### Workflow

- **Local Testing**: Use Python's built-in server for testing
- **Browser Setup**: Enable experimental flags for latest APIs
- **Version Control**: Use atomic commits with descriptive messages

### Code Patterns

- **HTML**: Semantic elements with `contain: layout;` for transition elements
- **CSS**: Unique `view-transition-name` for scoped elements
- **JavaScript**: Feature detection with `HTMLElement.prototype.startViewTransition`
- **Animations**: Custom transitions using `::view-transition-group()`, `::view-transition-old()`, `::view-transition-new()`

### Examples

```javascript
// Scoped view transition
element.startViewTransition(() => {
  element.innerHTML = newContent;
});

// Fallback for unsupported browsers
manualTransition(element, () => {
  element.innerHTML = newContent;
}, 600);
```

## Current Demos

- **[Scoped View Transitions](./demos/scoped-view-transitions/)**: Demonstrates post detail expansion with image morphing and multi-element transitions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your demo in `demos/<new-demo-name>/`
4. Ensure progressive enhancement and mobile optimization
5. Test in Chrome with experimental features
6. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details

## Resources

- [Scoped View Transitions Explainer](https://github.com/WICG/view-transitions/blob/main/scoped-transitions.md)
- [View Transitions API Documentation](https://developer.chrome.com/docs/web-platform/view-transitions)
- [Web Platform Features](https://chromestatus.com/features)
