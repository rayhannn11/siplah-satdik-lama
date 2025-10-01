// import { AUTH } from "./authActionTypes";
// const initialInit = false;

// function auth(state, auth) {
//     state = auth;
//     return state;
// }

// export default function authReducer(state = initialInit, action) {
//     switch (action.type) {
//         case AUTH:
//             return auth(state, action.auth);
//         default:
//             return state;
//     }
// }

import { AUTH } from "./authActionTypes";

// Perbaiki cara mengambil initial state
const getInitialState = () => {
    const authValue = localStorage.getItem("auth");
    return authValue === "true"; // Akan return false jika null atau 'false'
};

const initialState = getInitialState();

function auth(state, authValue, isLogout) {
    // Simpan ke localStorage hanya saat login/logout explicit
    if (isLogout) {
        // Menghapus 'auth' dari localStorage saat logout
        localStorage.removeItem("auth");
    } else if (authValue) {
        // Menyimpan 'auth' ke localStorage saat login
        localStorage.setItem("auth", "true");
    }
    return authValue;
}

export default function authReducer(state = initialState, action) {
    console.log(`ini adalkah action`, action);
    switch (action.type) {
        case AUTH:
            // Pass isLogout ke fungsi auth untuk menangani login/logout
            return auth(state, action.auth, action.isLogout);
        default:
            return state;
    }
}
