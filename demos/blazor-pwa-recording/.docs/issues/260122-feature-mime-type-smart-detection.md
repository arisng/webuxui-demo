# **Feature Issue: MIME Type Smart Detection**

**Date:** 2026-01-22  
**Feature ID:** mime-type-smart-detection  
**Priority:** P0  
**Status:** Done

## **Summary**

Select the best supported recording MIME type in the following order for maximum cross-browser compatibility:
1) `audio/webm;codecs=opus`  
2) `audio/mp4`  
3) `audio/webm`  
4) `audio/wav`

## **Implementation Notes (Actual State)**

`audio-engine.js` checks MIME types in this order:
- `audio/webm;codecs=opus`
- `audio/mp4`
- `audio/webm`
- `audio/wav`

## **Acceptance Criteria**

- MediaRecorder type selection iterates in the required order including `audio/webm` before `audio/wav`.
- Recording works on iOS Safari and Chromium.

## **Verification (Evidence)**

- `src/wwwroot/js/audio-engine.js` contains the ordered MIME list with `audio/webm` fallback.
