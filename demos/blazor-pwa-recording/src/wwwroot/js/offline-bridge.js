(() => {
    const READY_VERSION_KEY = "offline-ready-version";
    const UPDATE_VERSION_KEY = "app-update-version";
    const UPDATE_WAITING_SHOWN_KEY = "app-update-waiting-shown";
    let dotNetRef = null;
    let isReady = false;
    let isOnline = navigator.onLine;
    let lastStatus = null;
    let pendingReadyVersion = null;
    let pendingUpdateVersion = null;
    let updateRequested = false;
    let serviceWorkerRegistration = null;
    let hadController = false;

    const getStatus = () => {
        if (!isOnline) {
            return isReady ? "offline" : "offline-not-ready";
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
            dotNetRef.invokeMethodAsync("ShowOfflineReadyToast")
                .catch((error) => console.error("Offline toast failed", error));
        }
    };

    const shouldShowUpdatePrompt = (version) => {
        if (!version) {
            return false;
        }
        const storedVersion = getStoredUpdateVersion();
        if (storedVersion === version) {
            return false;
        }
        setStoredUpdateVersion(version);
        return true;
    };

    const showUpdatePrompt = (version) => {
        if (!hadController || !dotNetRef || !shouldShowUpdatePrompt(version)) {
            return;
        }
        dotNetRef.invokeMethodAsync("ShowAppUpdateToast", version)
            .catch((error) => console.error("Update toast failed", error));
    };

    const showUpdatePromptForce = () => {
        if (!hadController || !dotNetRef) {
            return;
        }
        if (hasShownWaitingPrompt()) {
            return;
        }
        setShownWaitingPrompt();
        dotNetRef.invokeMethodAsync("ShowAppUpdateToast", null)
            .catch((error) => console.error("Update toast failed", error));
    };

    const handleUpdateAvailable = (version) => {
        if (!version) {
            return;
        }
        if (!navigator.serviceWorker || !navigator.serviceWorker.controller) {
            pendingUpdateVersion = version;
            return;
        }
        showUpdatePrompt(version);
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
            if (data.type === "sw-update-available") {
                handleUpdateAvailable(data.version);
            }
        });

        navigator.serviceWorker.addEventListener("controllerchange", () => {
            if (updateRequested) {
                updateRequested = false;
                window.location.reload();
                return;
            }
            hadController = true;
            hydrateFromStorage();
            if (pendingReadyVersion && navigator.serviceWorker.controller) {
                applyReady(pendingReadyVersion);
            }
            if (pendingUpdateVersion && navigator.serviceWorker.controller) {
                showUpdatePrompt(pendingUpdateVersion);
                pendingUpdateVersion = null;
            }
            emitStatus();
        });

        try {
            serviceWorkerRegistration = await navigator.serviceWorker.register("service-worker.js", { updateViaCache: "none" });
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
            hadController = !!(navigator.serviceWorker && navigator.serviceWorker.controller);
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
        },
        checkForUpdates: async () => {
            if (!serviceWorkerRegistration) {
                return { ok: false, reason: "not-registered", hasUpdate: false };
            }
            try {
                await serviceWorkerRegistration.update();
                if (serviceWorkerRegistration.waiting) {
                    showUpdatePromptForce();
                    return { ok: true, hasUpdate: true };
                }
                return { ok: true, hasUpdate: false };
            } catch (error) {
                return { ok: false, reason: "update-failed", hasUpdate: false };
            }
        },
        requestAppUpdate: async () => {
            if (!serviceWorkerRegistration || !serviceWorkerRegistration.waiting) {
                return false;
            }
            updateRequested = true;
            serviceWorkerRegistration.waiting.postMessage({ type: "SKIP_WAITING" });
            return true;
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

    function getStoredUpdateVersion() {
        try {
            return localStorage.getItem(UPDATE_VERSION_KEY);
        } catch (error) {
            return null;
        }
    }

    function setStoredUpdateVersion(version) {
        try {
            localStorage.setItem(UPDATE_VERSION_KEY, version);
        } catch (error) {
        }
    }

    function hasShownWaitingPrompt() {
        try {
            return sessionStorage.getItem(UPDATE_WAITING_SHOWN_KEY) === "1";
        } catch (error) {
            return false;
        }
    }

    function setShownWaitingPrompt() {
        try {
            sessionStorage.setItem(UPDATE_WAITING_SHOWN_KEY, "1");
        } catch (error) {
        }
    }
})();
