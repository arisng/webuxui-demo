(() => {
    const READY_VERSION_KEY = "offline-ready-version";
    let dotNetRef = null;
    let isReady = false;
    let isOnline = navigator.onLine;
    let lastStatus = null;
    let pendingReadyVersion = null;

    const getStatus = () => {
        if (!isOnline) {
            return "offline";
        }
        return isReady ? "ready" : "downloading";
    };

    const emitStatus = () => {
        if (!dotNetRef) {
            return;
        }
        const status = getStatus();
        if (status === lastStatus) {
            return;
        }
        lastStatus = status;
        dotNetRef.invokeMethodAsync("SetOfflineStatus", status);
    };

    const shouldShowToast = (version) => {
        if (!version) {
            return false;
        }
        const storedVersion = getStoredVersion();
        if (storedVersion === version) {
            return false;
        }
        setStoredVersion(version);
        return true;
    };

    const handleReady = (version) => {
        if (!version) {
            return;
        }
        pendingReadyVersion = version;
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
            applyReady(version);
        }
    };

    const applyReady = (version) => {
        isReady = true;
        pendingReadyVersion = null;
        emitStatus();
        if (dotNetRef && shouldShowToast(version)) {
            dotNetRef.invokeMethodAsync("ShowOfflineReadyToast");
        }
    };

    const hydrateFromStorage = () => {
        const storedVersion = getStoredVersion();
        if (storedVersion && navigator.serviceWorker && navigator.serviceWorker.controller) {
            isReady = true;
        }
    };

    const registerServiceWorker = async () => {
        if (!("serviceWorker" in navigator)) {
            emitStatus();
            return;
        }

        navigator.serviceWorker.addEventListener("message", (event) => {
            const data = event.data || {};
            if (data.type === "offline-ready") {
                handleReady(data.version);
            }
        });

        navigator.serviceWorker.addEventListener("controllerchange", () => {
            hydrateFromStorage();
            if (pendingReadyVersion && navigator.serviceWorker.controller) {
                applyReady(pendingReadyVersion);
            }
            emitStatus();
        });

        try {
            await navigator.serviceWorker.register("service-worker.js", { updateViaCache: "none" });
            await navigator.serviceWorker.ready;
            hydrateFromStorage();
        } catch (error) {
            // Service worker registration failures should not block UI.
        }

        emitStatus();
    };

    window.offlineBridge = {
        init: async (dotNetObject) => {
            dotNetRef = dotNetObject;
            isOnline = navigator.onLine;
            hydrateFromStorage();
            emitStatus();

            window.addEventListener("online", () => {
                isOnline = true;
                emitStatus();
            });

            window.addEventListener("offline", () => {
                isOnline = false;
                emitStatus();
            });

            await registerServiceWorker();
        }
    };

    function getStoredVersion() {
        try {
            return localStorage.getItem(READY_VERSION_KEY);
        } catch (error) {
            return null;
        }
    }

    function setStoredVersion(version) {
        try {
            localStorage.setItem(READY_VERSION_KEY, version);
        } catch (error) {
        }
    }
})();
