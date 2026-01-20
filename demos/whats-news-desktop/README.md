# Requirement Specification: Edge "What's New" Desktop Demo

## 1. Project Overview
This project aims to replicate the "What's New" onboarding experience found in the Microsoft Edge desktop browser. The demo will focus on a high-fidelity UI implementation with smooth transitions between onboarding steps, leveraging modern web platform features.

## 2. Visual Design & Layout
- **Theme**: Dark Mode (Deep black/dark gray background).
- **Layout**:
  - **Standard Steps (1-4)**: Two-column layout.
    - **Left Column**: Text & Controls (Aligned left).
    - **Right Column**: Large Visual/Image.
  - **Final Step (5)**: Centered Layout.
    - **Header**: Centered at top.
    - **Content**: Horizontal row of 3 feature cards.
    - **Action**: Centered "Start browsing" button below cards.
  - **Footer**: Fixed at the bottom, spanning the full width.

### Color Palette (Inferred)
- **Background**: `#000000` or very dark gray `#111111`.
- **Primary Accent**: Edge Blue (approx. `#0078D4`) for buttons and active states.
- **Text**:
  - Headings: White `#FFFFFF`.
  - Body: Light Gray `#CCCCCC`.
- **Badges**:
  - "NEW" Badge: Yellow/Gold background `#F7B500` with black text.
- **Cards**: Dark gray background (slightly lighter than main bg) with rounded corners.

## 3. UI Components

### 3.1. Standard Step Components
- **Badge**: "NEW" label, small caps, rounded corners.
- **Headline**: Large, bold typography. Example: "Sign in faster with **passkeys**".
- **Description**: Paragraph text explaining the feature.
- **Primary Action**: "Learn more" button (Pill shape, light background, dark text).
- **Navigation Controls**:
  - **Back Button**: Icon-only (arrow left), blue background, rounded.
  - **Next Button**: Text "Next" + Icon (arrow right), blue background, pill shape.
- **Visual Area**: Large rounded rectangle container acting as a placeholder.

### 3.2. Final Step Components (Step 5)
- **Headline**: Centered, e.g., "Enjoy these latest features and much more with Microsoft Edge."
- **Feature Cards**: Row of 3 cards.
  - **Image**: Top section of card.
  - **Label**: Bottom section, centered text (e.g., "Ask Copilot").
  - **Style**: Dark rounded rectangle container.
- **Primary Action**: "Start browsing" button (Large, Blue, Pill shape).

### 3.3. Footer
- **Left**: Branding area. Edge Logo + Text "Here's what's new in Microsoft Edge".
- **Center**: **Progress Stepper**.
  - Indicators for Steps 1 through 5.
  - Active state: Highlighted progress bar, Step Title (e.g., "Passkeys"), and optional badge.
  - Inactive state: Thin gray line, Step Number.
- **Right**: Search Bar.
  - Pill-shaped input field.
  - Placeholder: "Search the web".
  - Search icon on the right.

## 4. Functional Requirements
- **Step Navigation**:
  - Clicking "Next" advances to the next step.
  - Clicking "Back" returns to the previous step.
  - **Layout Transition**: The layout must smoothly transition from 2-column (Steps 1-4) to Centered (Step 5).
- **Stepper Interaction**:
  - The footer progress bar must reflect the current active step.
  - Step 5 Label: "Get started".
- **Responsiveness**:
  - Desktop-first, scaling gracefully.

## 5. Technical Requirements
- **Tech Stack**: HTML5, CSS3, Vanilla JavaScript.
- **Animation**:
  - Use **View Transitions API** to animate the content changes between steps.
  - Handle layout shift between Step 4 and Step 5 smoothly.
- **Accessibility**:
  - Semantic HTML.
  - Keyboard navigation support.

## 6. Content Data (Mock)
- **Step 1**: Passkeys (Headline: "Sign in faster with passkeys")
- **Step 2**: AI Features (Headline: "Browse smarter with AI")
- **Step 3**: Shopping (Headline: "Save money while you shop")
- **Step 4**: Security (Headline: "Stay safe online")
- **Step 5**: Get Started
  - **Headline**: "Enjoy these latest features and much more with Microsoft Edge."
  - **Cards**:
    1. "Ask Copilot"
    2. "Create a theme"
    3. "Pin sites"
  - **Button**: "Start browsing"
