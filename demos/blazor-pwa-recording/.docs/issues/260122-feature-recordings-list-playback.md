# **Feature Issue: Recordings List & Playback**

**Date:** 2026-01-22  
**Feature ID:** recordings-list-playback  
**Priority:** P0  
**Status:** Done

## **Summary**

List saved recordings (newest-first) with play/pause and delete actions.

## **Implementation Notes (Actual State)**

- Playback and delete actions exist in `Home.razor` and `audio-engine.js`.
- Recordings are sorted newest-first in `AudioApp.getRecordings()` by timestamp.

## **Acceptance Criteria**

- Recordings list is sorted newest-first.
- Each item can be played/paused and deleted.

## **Verification (Evidence)**

- `src/Pages/Home.razor` renders recording cards and controls.
- `src/wwwroot/js/audio-engine.js` implements playback/deletion and newest-first sorting.
