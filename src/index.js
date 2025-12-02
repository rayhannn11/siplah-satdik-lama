// react
import React from "react";

// third-party
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

// application
import * as serviceWorker from "./serviceWorker";
import * as serviceWorker2 from "./serviceWorker2";

import Root from "./components/Root";
import store from "./store";
import { startVersionChecker } from "./services/versionChecker";

import { startVersionCheckerV2 } from "./version-checker";

// styles
import "slick-carousel/slick/slick.css";
import "react-vertical-timeline-component/style.min.css";
import "sweetalert2/src/sweetalert2.scss";
import "react-toastify/dist/ReactToastify.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-input-range/lib/css/index.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-daterangepicker/daterangepicker.css";
import "typeface-roboto";
import "./scss/style.scss";
import { PersistGate } from "redux-persist/integration/react";
import persistStore from "redux-persist/es/persistStore";
import { BrowserRouter } from "react-router-dom";
import Swal from "sweetalert2";

const appPersistor = persistStore(store);
// startVersionCheckerV2();
ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading="null" persistor={appPersistor}>
            <BrowserRouter basename={process.env.PUBLIC_URL}>
                <Root />
            </BrowserRouter>
        </PersistGate>
    </Provider>,
    document.getElementById("root")
);

// serviceWorker.register({
//     onUpdate: (registration) => {
//         if (registration && registration.waiting) {
//             const updateWorker = registration.waiting;
//             // Skip notification and directly refresh
//             updateWorker.postMessage({ type: "SKIP_WAITING" });
//             window.location.reload();
//         }
//     },
// });

serviceWorker2.register({
    onUpdate: async (registration) => {
        console.log("%c[APP] Update tersedia!", "color: orange;");

        // Hapus seluruh cache (meski SW tidak caching)
        if ("caches" in window) {
            const keys = await caches.keys();
            await Promise.all(keys.map((key) => caches.delete(key)));
        }

        // Minta SW baru untuk ambil alih
        if (registration.waiting) {
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
        }

        // Reload setelah SW aktif
        navigator.serviceWorker.addEventListener("controllerchange", () => {
            console.log("[APP] Versi baru aktif → reload");
            window.location.reload();
        });
    },
});
// Start version checker to check for updates every 1.5 minutes
startVersionChecker();
