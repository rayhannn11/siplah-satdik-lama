/* eslint-disable no-restricted-globals */

// BASE URL sesuai hosting kamu
const BASE_URL = "/satdik";

/* =======================================================
   SERVICE WORKER — ENTERPRISE ZERO-CACHE VERSION
   ======================================================= */

self.addEventListener("install", (event) => {
    // langsung aktif tanpa menunggu SW lama selesai
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    // ambil kendali segera di semua tab
    event.waitUntil(self.clients.claim());
});

// Tidak caching apa pun. Semua request diarahkan ke network.
self.addEventListener("fetch", (event) => {
    // Biarkan browser fetch langsung tanpa caching
    return;
});

// Untuk menerima perintah SKIP_WAITING dari index.js
self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});
