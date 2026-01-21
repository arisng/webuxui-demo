// In development, always fetch from the network and do not enable offline support.
// This is because caching would make development more difficult (changes would not
// be reflected on the first load after each change).
//
// This fetch handler is required for PWA installability checks. 
// By providing an empty handler, we satisfy the browser's requirement for a 
// fetch listener while ensuring development changes are immediately visible.
self.addEventListener('fetch', (event) => {
    // No-op: just having the listener is enough for PWA installability.
});
