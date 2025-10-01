// third-party
import { createStore, applyMiddleware, compose } from "redux";
import { encryptTransform } from "redux-persist-transform-encrypt";
import { persistReducer, } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";

// reducer
import rootReducer from "./rootReducer";
import { AUTH } from "./auth/authActionTypes";

const encryptor = encryptTransform({
    secretKey: "masdis-mdi-8h47sd6",
});

const config = {
    key: "primary",
    storage,
    transforms: [encryptor],
};

const rootedReducer = (state, action) => {
    // Jangan reset state saat refresh, hanya saat explicit logout
    if (action.type === AUTH) {
        if (!action.auth && action.isLogout) {  
            state = undefined;
        }
    } else if (action.type === 'RESET') {
        state = undefined;
    }
    return rootReducer(state, action);
};

const persistedReducer = persistReducer(config, rootedReducer);
// function load() {
//     let state;

//     try {
//         state = localStorage.getItem("state");

//         if (typeof state === "string") {
//             state = JSON.parse(state);
//         }

//         if (state && state.version !== version) {
//             state = undefined;
//         }
//     } catch (error) {
//         // eslint-disable-next-line no-console
//         console.error(error);
//     }

//     return state || undefined;
// }

const store = createStore(
    persistedReducer,
    // load(),
    compose(
        applyMiddleware(thunk)
        // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);

// function save() {
//     try {
//         localStorage.setItem("state", JSON.stringify(store.getState()));
//     } catch (error) {
//         // eslint-disable-next-line no-console
//         console.error(error);
//     }
// }

// store.subscribe(() => save());

export default store;
