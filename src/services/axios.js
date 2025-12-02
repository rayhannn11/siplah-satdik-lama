import axios from "axios";
import store from "../store"; // pastikan mengarah ke store redux kamu
import { resetMiniCart } from "../store/mini-cart";
import { resetFirstLogin } from "../store/first-login/firstLoginActions";
import { logoutCustomer } from "../store/auth/authActions";

// Inisialisasi instance axios
const api = axios.create({
    baseURL: process.env.REACT_APP_URL_SIPLAH,
    timeout: 10000,
});

// === Request Interceptor ===
// Tambahkan Authorization Header dari localStorage
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// === Response Interceptor ===
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            const { dispatch } = store;

            // 🔹 Clear semua data dari localStorage
            localStorage.removeItem("auth");
            localStorage.removeItem("token");
            localStorage.removeItem("userData");
            localStorage.removeItem("persist:primary");
            localStorage.removeItem("notifShown");
            localStorage.clear();

            // 🔹 Reset Redux state
            dispatch(resetMiniCart());
            dispatch(resetFirstLogin());
            dispatch(logoutCustomer());

            // 🔹 Redirect ke halaman login
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default api;
