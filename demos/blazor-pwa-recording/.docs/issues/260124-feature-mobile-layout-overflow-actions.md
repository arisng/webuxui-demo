# **Feature Issue: Mobile Layout Overflow Actions**

**Date:** 2026-01-24  
**Feature ID:** mobile-layout-overflow-actions  
**Priority:** P2  
**Status:** In Progress

## **Summary**

Introduce a mobile-first header overflow menu that hides secondary actions (e.g., “Check updates”) by default while preserving the existing offline status text + dot.

## **Design Direction**

- **Header (mobile):**
  - Keep offline status as **text + dot**.
  - Add a **three-dot overflow icon** aligned to the right.
  - Reduce header text size if needed to avoid wrapping or crowding.
- **Actions surface (mobile):**
  - Use a **bottom sheet** (not a floating card).
  - Full-width, touch-friendly rows (>=44px).
  - Designed to scale as more actions are added.
- **Update availability:**
  - If updates are available, show a subtle badge on the overflow icon.
  - The “Update available” action appears at the top of the sheet.

## **Scope**

- Mobile layout only (desktop gets its own feature later).
- Visual treatment consistent with existing glass header and toast styling.

## **Acceptance Criteria**

- Mobile header retains offline status text + dot with no truncation on common widths (>=360px).
- Overflow icon is visible and reachable without overlapping the status text.
- “Check updates” is accessible only from the bottom sheet by default.
- Bottom sheet supports future actions without layout changes.

## **Verification (Pending)**

- Test at 360px, 390px, 414px widths.
- Confirm no header wrapping/clipping with offline status text.
- Confirm sheet opens/closes smoothly and is keyboard accessible.

## **Progress Update**

- 2026-01-24: Implemented bottom sheet overflow in `MainLayoutV2` and set as default layout in `App.razor`.
