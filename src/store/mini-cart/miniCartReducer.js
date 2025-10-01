import { MINI_CART_ADD_ITEM, MINI_CART_RESET } from "./miniCartActionTypes";

const initialState = {
    totalAllProduct: 0,
    items: {
        product: [],
    },
};

function addMiniCart(state, miniCart) {
    if (state !== miniCart) {
        state = miniCart;
    }
    return state;
}

export default function miniCartReducer(state = initialState, action) {
    switch (action.type) {
        case MINI_CART_ADD_ITEM:
            return addMiniCart(state, action.miniCart);
        case MINI_CART_RESET:
            return state
        default:
            return state;
    }
}
