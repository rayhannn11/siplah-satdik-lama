import Swal from "sweetalert2";

const VERSION_KEY = "__app_version";

// Detect otomatis base url (misal /satdik)
function getBaseUrl() {
    const base = document.querySelector("base")?.getAttribute("href");
    return base && base !== "/" ? base.replace(/\/$/, "") : "";
}

export async function checkVersion() {
    try {
        const baseUrl = getBaseUrl();
        const versionUrl = `${baseUrl}/version.json`;

        // Ambil versi terbaru dari server
        const res = await fetch(versionUrl, {
            cache: "no-store",
            headers: { "Cache-Control": "no-cache" },
        });

        if (!res.ok) {
            console.error(`Failed fetching ${versionUrl}`, res.status);
            return;
        }

        const data = await res.json();
        const latestVersion = data.version.toString();
        const storedVersion = localStorage.getItem(VERSION_KEY);

        // Jika pertama buka → simpan versi
        if (!storedVersion) {
            localStorage.setItem(VERSION_KEY, latestVersion);
            return;
        }

        // Jika versi berubah → lakukan proses update
        if (storedVersion !== latestVersion) {
            console.log(
                `%cVERSION CHANGED → OLD=${storedVersion}, NEW=${latestVersion}`,
                "background:#28a745;color:white;padding:4px;"
            );

            await Swal.fire({
                title: "Update Tersedia",
                text: "Versi terbaru aplikasi ditemukan. Halaman akan diperbarui.",
                icon: "info",
                confirmButtonText: "Perbarui Sekarang",
                allowOutsideClick: false,
            });

            // Update versi ke localStorage
            localStorage.setItem(VERSION_KEY, latestVersion);

            // Hapus semua localStorage kecuali VERSION_KEY
            Object.keys(localStorage).forEach((key) => {
                if (key !== VERSION_KEY) {
                    localStorage.removeItem(key);
                }
            });

            // Hapus semua cache (Cache Storage API)
            if ("caches" in window) {
                const cacheKeys = await caches.keys();
                await Promise.all(cacheKeys.map((key) => caches.delete(key)));
            }

            // Hentikan semua Service Worker
            if (navigator.serviceWorker) {
                const regs = await navigator.serviceWorker.getRegistrations();
                for (const reg of regs) await reg.unregister();
            }

            // Delay untuk memastikan semua commit selesai
            setTimeout(() => {
                const cleanUrl =
                    window.location.origin + window.location.pathname + `?app_version=${latestVersion}&t=${Date.now()}`;

                window.location.replace(cleanUrl);
            }, 300);
        }
    } catch (err) {
        console.error("Version check error:", err);
    }
}

/**
 * Interval checker -> cek versi tiap N ms
 */
export function startVersionCheckerV2(intervalMs = 90000) {
    // Pastikan sudah DOM ready
    window.addEventListener("load", () => {
        checkVersion();
        setInterval(checkVersion, intervalMs);
    });
}
