import { CHECKOUT_ADD_ITEM, CHECKOUT_REMOVE_ITEM } from "./checkoutActionTypes";

const initialState = {
    id: null,
    subTotal: 0,
    ppn: 0,
    total: 0,
    isCompare: false,
    isSuccessCompare: false,
    alertCompare: "",
    shipping: {},
    mall: {
        name: null,
        slug: null,
        image: null,
    },
    product: [],
};

const addItem = (state, cart) => {
    if (state.id !== cart.id) {
        state = cart;
    }
    return state;
};

const removeItem = (state) => {
    state = initialState;
    return state;
};

export default function checkoutReducer(state = initialState, action) {
    switch (action.type) {
        case CHECKOUT_ADD_ITEM:
            return addItem(state, action.payload);
        case CHECKOUT_REMOVE_ITEM:
            return removeItem(state);
        default:
            return state;
    }
}
