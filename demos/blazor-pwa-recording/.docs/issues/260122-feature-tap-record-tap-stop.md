# **Feature Issue: Recording (Tap-to-Record / Tap-to-Stop)**

**Date:** 2026-01-22  
**Feature ID:** tap-record-tap-stop  
**Priority:** P0  
**Status:** Done

## **Summary**

Provide a single control that starts recording on first tap and stops + autosaves on second tap.

## **Implementation Notes (Actual State)**

- `Home.razor` toggles recording state and calls `IAudioService.StartRecording()` / `StopRecording()`.
- JS `AudioApp.stopRecording()` stops MediaRecorder and saves the blob to IndexedDB via `AudioStore.save()`.

## **Acceptance Criteria**

- One tap starts recording.
- Second tap stops recording and auto-saves the result.
- UI reflects recording state (REC/STOP).

## **Verification (Evidence)**

- `src/Pages/Home.razor` uses `ToggleRecording` to start/stop.
- `src/wwwroot/js/audio-engine.js` implements `AudioApp.startRecording` / `stopRecording` and persists recordings.
