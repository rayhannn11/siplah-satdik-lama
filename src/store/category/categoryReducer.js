import { CATEGORY_ADD_LIST } from "./categoryActionTypes";

const initialState = {
    categories: []
}

export default function cartReducer(state = initialState, action) {
    switch (action.type) {
        case CATEGORY_ADD_LIST:
            return {
                categories: action.payload
            };
        default:
            return state;
    }
}