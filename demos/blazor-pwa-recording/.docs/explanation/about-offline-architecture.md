# Understanding Offline Architecture in SonicMemo

This document explains the conceptual design decisions behind SonicMemo's offline-first capabilities and why Blazor WebAssembly was chosen for this implementation.

## Why Blazor WebAssembly?

SonicMemo requires high-performance audio processing and complex client-side state management. Blazor WebAssembly allows us to:
- **Share C# Models**: The `RecordingModel` is shared between the UI and the persistence layer.
- **Native Performance**: .NET execution on the web allows for efficient handling of large Blobs (audio data).
- **Offline Reliability**: The entire runtime is downloaded to the client, removing the need for a round-trip to a server for application logic.

## The Three Pillars of Offline

### 1. The App Shell (Service Worker)
The Service Worker acts as a programmable proxy between the browser and the network.
- **Caching**: It caches the DLLs, static assets (HTML/CSS/JS), and the manifest.
- **Interception**: When the network is unavailable, it serves the cached "App Shell" immediately.

### 2. Data Persistence (IndexedDB)
Since cookies and LocalStorage have strict size limits, SonicMemo uses **IndexedDB**.
- **Audio Blobs**: Voice recordings are stored as `Blob` objects directly in the browser's database.
- **Metadata**: Timestamps, durations, and status flags are stored alongside the audio data.

### 3. Progressive Enhancement
SonicMemo is designed to work even if the Service Worker isn't registered, but it "steps up" its capabilities when it is.
- **Graceful Degradation**: If the user is on an older browser, they can still record and play back, but they won't have offline access or installation prompts.

## State Synchronization Flow

1. **User Action**: Record is stopped.
2. **Local Commit**: UI immediately updates and saves to IndexedDB.
3. **Background Sync**: (Future feature) The Service Worker monitors network status and pushes data to a remote server when connectivity returns.

## See also

- [Reference: Service Worker Configuration](../../reference/service-worker-config.md)
- [How to: Publish and run locally](../../how-to/deploy/how-to-publish-and-run-locally.md)
