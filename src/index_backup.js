// react
import React from "react";

// third-party
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

// application
import * as serviceWorker from "./serviceWorker";
import Root from "./components/Root";
import store from "./store";

// stylespm
import "slick-carousel/slick/slick.css";
import "react-vertical-timeline-component/style.min.css";
import "sweetalert2/src/sweetalert2.scss";
import "react-toastify/dist/ReactToastify.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-input-range/lib/css/index.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-daterangepicker/daterangepicker.css";
import 'typeface-roboto'
import "./scss/style.scss";
import { PersistGate } from "redux-persist/integration/react";
import persistStore from "redux-persist/es/persistStore";
import { BrowserRouter } from "react-router-dom";
const appPersistor = persistStore(store);

ReactDOM.render(
    // eslint-disable-next-line react/jsx-filename-extension
    <Provider store={store}>
        <PersistGate loading="null" persistor={appPersistor}>
            <BrowserRouter basename={process.env.PUBLIC_URL}>
                <Root />
            </BrowserRouter>
        </PersistGate>
    </Provider>,
    document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
