# **Product Specification: Blazor Recording PWA (POC)**

Date: 2026-01-14  
Target Framework: .NET 10 (Blazor Web App)  
Type: Progressive Web App (PWA)  
Priority: High Performance, Offline-First

## **1\. Executive Summary**

The goal is to build a "zero-friction" audio recording PWA. We prioritize **Instant First Load** by utilizing **Blazor Auto Render Mode**. The application will initially serve interactive UI via a .NET Server (SignalR) while the WebAssembly runtime downloads in the background. Once cached, the app transitions to a fully offline-capable Wasm client on subsequent launches.

## **2\. Technical Architecture**

### **2.1 Technology Stack**

* **Framework:** Microsoft .NET 10 Blazor Web App.  
* **Render Mode:** **InteractiveAuto**.  
  * *Offline Strategy:* **Critical.** By default, Auto mode relies on server routing. We must customize service-worker.published.js to intercept navigation requests and serve the cached App Shell (index.html) when offline (Referencing *dotnet/aspnetcore issue \#60895*).  
* **Compilation:** **Standard (JIT)**. AOT is disabled to keep the background download bundle smaller (\~4MB vs \~15MB).  
* **Audio Capture:** Native Browser MediaRecorder API (via JS Interop).  
* **Storage:** IndexedDB (Browser Native).  
* **Deployment:** Docker Container (Linux) on AWS EC2.

### **2.2 Data Flow & Bridge**

The architectural challenge in Auto mode is that the C\# code might be running on the Server (via SignalR) or Client (Wasm).

* **The Constant:** IndexedDB and AudioEngine.js *always* reside in the browser.  
* **The Abstraction:** An IAudioService interface will handle the Interop.  
  * **Server Mode:** Calls JS via SignalR.  
  * **Wasm Mode:** Calls JS via Direct Interop.  
* **Data Integrity:** Audio blobs *never* leave the browser. Metadata is fetched by C\# regardless of where C\# is running.

## **3\. Functional Requirements**

### **3.1 Recording Engine**

* **Input:** Default System Microphone.  
* **Format Strategy (Smart Detection):**  
  * The JS engine must iterate through supported MIME types in this order to ensure iOS compatibility:  
    1. audio/webm; codecs=opus (Preferred for Chrome/Android)  
    2. audio/mp4 (Preferred for Safari iOS 15+)  
    3. audio/webm (Fallback)  
    4. audio/wav (Last resort, uncompressed)  
* **UX:**  
  * Tap-to-Record (Single interaction).  
  * Tap-to-Stop (Auto-save).  
* **Latency:** Standard SignalR network latency is acceptable.  
* **Interruption Handling:** Listen to visibilitychange to auto-stop recording when the user switches apps.

### **3.2 Storage (IndexedDB)**

* **Database Name:** AudioStore  
* **Store Name:** Recordings  
* **Schema:** { id: (auto-inc), blob: (binary), timestamp: (ISO String), duration: (float) }  
* **Eviction Protection:** App must call navigator.storage.persist() on startup to prevent Safari/iOS from scrubbing data after 7 days of inactivity.

### **3.3 Management & Playback**

* **List View:** Sorted by newest first.  
* **Playback:** Internal audio player or new tab.  
* **CRUD:** **Ability to Delete recordings.**

### **3.4 Onboarding & Offline UX (Simplified)**

* **"Update" Prompt:** Once the Wasm runtime is fully cached by the Service Worker:  
  * **Trigger:** Service Worker state change (installed / waiting).  
  * **UI:** A non-blocking Toast/Banner at the bottom: *"Offline mode is ready. Tap to reload."*  
  * **Action:** Reloads the page, switching the app execution context from Server to Wasm.

## **4\. Non-Functional Requirements**

### **4.1 Performance**

* **First Load (Online):** \< 1.0s (SSR).  
* **Subsequent Load (Offline):** \< 1.0s (Service Worker).  
* **Transition:** The switch from Server to Wasm must be seamless (handled via Reload).

### **4.2 Offline Capability**

* **First Run:** Requires Internet.  
* **Subsequent Runs:** Functions 100% offline.

## **5\. UI/UX Design Specifications**

### **5.1 Layout**

* **Header:** Minimalist.  
* **Center Stage:** Large (150px+) circular interaction button.  
* **Footer/List:** List of recordings with Play/Delete controls.

### **5.2 Interaction States**

* **Standard Updates:** UI updates rely on the standard Blazor event cycle.  
* **Offline Toast:** Green/Blue banner: "⚡ App is ready for offline use. Update now."

## **6\. Implementation Checklist (.NET 10\)**

* \[ \] **Project Setup:** dotnet new blazor \-int Auto \--pwa (Note: \-int Auto enables the Server/Client split).  
* \[ \] **Config:** Ensure RunAOTCompilation is FALSE.  
* \[ \] **Dual-Mode Interop:** Ensure AudioService works whether IJSRuntime is remote (SignalR) or local.  
* \[ \] **JS Layer:**  
  * \[ \] **Capabilities Check:** Implement isTypeSupported loop for iOS support.  
  * \[ \] **Persistence:** Call navigator.storage.persist().  
  * \[ \] openDb, start, stop, save, delete.  
  * \[ \] visibilitychange listener.  
* \[ \] **Service Worker (Critical):** Customize service-worker.published.js to intercept navigation and serve index.html to fix "Auto" mode offline routing.  
* \[ \] **Deploy:**  
  * \[ \] Dockerfile for ASP.NET Core Runtime.  
  * \[ \] **EC2 Config:** Ensure Load Balancer/Nginx allows Upgrade: websocket for SignalR.

## **7\. Future Considerations**

* **Transcription:** Upload Blob to OpenAI Whisper API.  
* **Sync:** Background sync to Cloud.