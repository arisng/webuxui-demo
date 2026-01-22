# **Product Specification: Blazor Audio PWA (POC) v3.0**

**Date:** 2026-01-22

**Target Framework:** .NET 10 (Blazor Web App)

**Render Mode:** InteractiveAuto

**Priority:** High Performance, Offline Awareness, iOS Compatibility

## **1\. Executive Summary**

The goal is to build a "zero-friction" audio recording PWA. We prioritize **Instant First Load** via **Blazor Auto Render Mode** (Server-first), while background-loading the WebAssembly runtime.

**v3.0 Update:** Addressing the "Auto Mode Paradox"—users don't know when the app is safe to use offline. We will implement an **Offline Readiness Notification system**. The app will detect when the Service Worker has finished caching the WASM bundle and display a toast: *"Ready for Airplane Mode"*. This allows the user to confidently disconnect without losing data.

## **2\. Technical Architecture**

### **2.1 Technology Stack**

* **Framework:** Microsoft .NET 10 Blazor Web App.  
* **Render Mode:** InteractiveAuto (Server start \-\> Client takeover).  
* **Service Worker:** **Workbox v7+** (NetworkFirst Strategy).  
* **State Management:** **Service Worker Message Bridge** (JS \-\> Blazor Server).  
* **Audio Capture:** Native MediaRecorder \+ Workbox RangeRequestsPlugin.

### **2.2 The "Auto" Mode Offline Solution**

1. **App Shell:** Static index.html (Client/wwwroot) serving as the offline fallback.  
2. **Navigation Interceptor:** Workbox NetworkFirst strategy redirects failed navigation to the App Shell.  
3. **Readiness Detector (New):**  
   * **Problem:** On first load (SSR), the browser downloads \~4MB of WASM/DLLs in the background. If the user disconnects before this finishes, the offline mode will fail.  
   * **Solution:** We use workbox-window on the main thread to listen for the activated event, confirming the assets are secured.

## **3\. Offline Readiness & User Notification (New)**

### **3.1 The UX Flow**

1. **Initial Load:** User sees the UI immediately (served by .NET Server). No download delay.  
2. **Background Activity:** The Service Worker begins downloading the .wasm, .dll, and index.html files.  
3. **Notification:** Once the Service Worker enters the controlled state (caching complete):  
   * **Toast Appears:** "⚡ App is ready for offline use."  
   * **Action:** The user can now safely switch to Airplane Mode.

### **3.2 Implementation Logic**

* **Library:** Import workbox-window module in App.razor.  
* **JS Listener:**  
  import { Workbox } from '\[https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-window.prod.mjs\](https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-window.prod.mjs)';

  if ('serviceWorker' in navigator) {  
      const wb \= new Workbox('/service-worker.js');

      // Fires when the service worker is controlling the page (First install complete)  
      wb.addEventListener('controlling', (event) \=\> {  
           // 1\. Detect if this is a fresh install (not an update)  
           if (\!event.isUpdate) {  
               // 2\. Bridge to Blazor (via SignalR if on Server, or direct if on WASM)  
               DotNet.invokeMethodAsync('BlazorAudioPWA', 'ShowOfflineReadyToast');  
           }  
      });

      wb.register();  
  }

* **Blazor Component:** A MainLayout.razor method \[JSInvokable\] that toggles a boolean ShowOfflineToast \= true.

## **4\. Audio Handling & iOS Compatibility**

* **Strategy:** workbox.strategies.CacheFirst.  
* **iOS Fix:** workbox.rangeRequests.RangeRequestsPlugin (Mandatory for Safari seeking).  
* **Storage Policy:** ExpirationPlugin (Max 50 items / 30 Days).

## **5\. UI/UX Design Specifications**

* **Visual Indicator:** A small "Cloud" icon in the header.  
  * *Grey/Blinking:* Downloading WASM runtime.  
  * *Green Check:* Offline Ready (WASM cached).  
  * *Red Slash:* Offline Mode Active.  
* **Center Stage:** 150px Circular Record Button.  
* **Toast:** Non-intrusive bottom-center notification for "Offline Ready".

## **6\. Implementation Checklist**

### **6.1 Workbox & Offline Logic**

* \[ \] **Import:** Add workbox-window to App.razor (Main Thread).  
* \[ \] **Service Worker:** Configure service-worker.published.js with NetworkFirst (Navigation) & CacheFirst (Audio).  
* \[ \] **App Shell:** Ensure Client/wwwroot/index.html exists and loads \_framework/blazor.web.js.

### **6.2 The Bridge (Readiness)**

* \[ \] **JS Interop:** Create boot.js to handle wb.addEventListener('controlling').  
* \[ \] **Blazor Method:** Create static \[JSInvokable\] ShowOfflineReadyToast.  
* \[ \] **SignalR Latency:** Ensure the method can be called over the SignalR circuit (since the user is on Server mode initially).

### **6.3 Standard Features**

* \[ \] **Audio Engine:** MediaRecorder implementation.  
* \[ \] **Persistence:** navigator.storage.persist().  
* \[ \] **PWA Manifest:** Ensure display: standalone and icons are set.