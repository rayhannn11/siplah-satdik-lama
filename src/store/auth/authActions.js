import { AUTH } from "./authActionTypes";

export function loginCustomer(auth) {
    return { type: AUTH, auth };
}

export function resetRedux() {
    return { type: "RESET" };
}

export function logoutCustomer() {
    return { type: AUTH, auth: false, isLogout: true };
}
