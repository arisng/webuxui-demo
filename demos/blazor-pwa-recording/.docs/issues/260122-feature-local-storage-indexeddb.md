# **Feature Issue: Local Storage (IndexedDB)**

**Date:** 2026-01-22  
**Feature ID:** local-storage-indexeddb  
**Priority:** P0  
**Status:** Done

## **Summary**

Persist recordings locally using IndexedDB (`AudioStore` / `Recordings`).

## **Implementation Notes (Actual State)**

- `AudioStore` opens DB `AudioStore` and creates object store `Recordings` with auto-increment key.
- `save`, `getAll`, `get`, and `delete` are implemented.
- Stored fields include `id`, `blob`, `timestamp`, and `duration`.

## **Acceptance Criteria**

- Recordings persist across reloads.
- New recordings are saved and can be listed and deleted.

## **Verification (Evidence)**

- `src/wwwroot/js/audio-engine.js` implements `AudioStore` and CRUD operations.
