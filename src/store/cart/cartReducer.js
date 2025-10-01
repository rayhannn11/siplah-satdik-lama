/*eslint no-unused-vars: "error"*/
import { FETCH_CART_LIST, FETCH_CART_LIST_SUCCESS, SET_OPTION_VALUE } from "../../data/constant";

/**
 * @param {array} items
 * @param {object} product
 * @param {array} options
 * @return {number}
 */

const initialState = {
    cartList: null,
    cartListIsLoading: true,
    options: { page: 1, limit: 3 },
};
export default function cartReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_CART_LIST:
            return {
                ...state,
                cartListIsLoading: true,
            };
        case FETCH_CART_LIST_SUCCESS:
            return {
                ...state,
                cartListIsLoading: false,
                cartList: action.payload,
            };
        case SET_OPTION_VALUE:
            return {
                ...state,
                options: { ...state.options, page: action.payload },
            };
        default:
            return state;
    }
}
