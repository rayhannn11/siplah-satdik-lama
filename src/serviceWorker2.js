/* eslint-disable no-console */

const isLocalhost = Boolean(
    window.location.hostname === "localhost" ||
        window.location.hostname === "[::1]" ||
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/.test(window.location.hostname)
);

function registerValidSW(swUrl, config) {
    navigator.serviceWorker
        .register(swUrl, { updateViaCache: "none" })
        .then((registration) => {
            console.log("[SW] Registered", registration);

            // Jika SW baru ditemukan
            registration.onupdatefound = () => {
                const installingWorker = registration.installing;
                if (!installingWorker) return;

                installingWorker.onstatechange = async () => {
                    if (installingWorker.state === "installed") {
                        if (navigator.serviceWorker.controller) {
                            console.log("[SW] Update ditemukan");

                            await clearAllCaches();

                            installingWorker.postMessage({
                                type: "SKIP_WAITING",
                            });

                            if (config?.onUpdate) config.onUpdate(registration);
                        } else {
                            console.log("[SW] Konten di-cache untuk offline");
                            if (config?.onSuccess) config.onSuccess(registration);
                        }
                    }
                };
            };
        })
        .catch((err) => {
            console.error("[SW] Registration failed:", err);
        });
}

async function clearAllCaches() {
    if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
        console.log("[SW] Semua cache berhasil dihapus");
    }
}

function checkValidServiceWorker(swUrl, config) {
    fetch(swUrl, { cache: "no-store" })
        .then((res) => {
            const contentType = res.headers.get("content-type");

            if (res.status === 404 || !contentType?.includes("javascript")) {
                navigator.serviceWorker.ready.then((registration) => {
                    registration.unregister().then(() => {
                        window.location.reload();
                    });
                });
            } else {
                registerValidSW(swUrl, config);
            }
        })
        .catch(() => console.log("[SW] Offline mode — tidak bisa fetch SW"));
}

export function register(config) {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
        const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);

        if (publicUrl.origin !== window.location.origin) return;

        window.addEventListener("load", () => {
            const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

            isLocalhost ? checkValidServiceWorker(swUrl, config) : registerValidSW(swUrl, config);
        });
    }
}

export function unregister() {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready.then((reg) => reg.unregister());
    }
}
