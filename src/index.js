// react
import React from "react";

// third-party
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

// application
import * as serviceWorker from "./serviceWorker";
import Root from "./components/Root";
import store from "./store";
import { startVersionChecker } from "./services/versionChecker";

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

serviceWorker.register({
    onUpdate: (registration) => {
        if (registration && registration.waiting) {
            const updateWorker = registration.waiting;
            // Skip notification and directly refresh
            updateWorker.postMessage({ type: "SKIP_WAITING" });
            window.location.reload();
        }
    },
});

// Start version checker to check for updates every 1.5 minutes
startVersionChecker();
