# **Feature Issue: Persistence Protection**

**Date:** 2026-01-22  
**Feature ID:** persistence-protection  
**Priority:** P0  
**Status:** Done

## **Summary**

Request persistent storage to reduce IndexedDB eviction risk, especially on iOS.

## **Implementation Notes (Actual State)**

- `navigator.storage.persist()` is invoked once when `AudioStore` is created.

## **Acceptance Criteria**

- Persistence request is triggered at startup.

## **Verification (Evidence)**

- `src/wwwroot/js/audio-engine.js` calls `navigator.storage.persist()` inside `AudioStore` constructor.
