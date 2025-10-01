import { MINI_CART_ADD_ITEM, MINI_CART_RESET } from "./miniCartActionTypes";

export function addMiniCart(miniCart) {
    return {
        type: MINI_CART_ADD_ITEM,
        miniCart,
    };
}

export function resetMiniCart() {
    return {
        type: MINI_CART_RESET,
    };
}
