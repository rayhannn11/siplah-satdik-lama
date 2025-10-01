import { NEW_MESSAGE_ADD } from "./newMessageActionTypes";

const initialState = 0

function newMessageAdd(state, customer) {
    if (customer !== state) {
        state = customer;
    }
    return state;
}

export default function customerReducer(state = initialState, action) {
    switch (action.type) {
        case NEW_MESSAGE_ADD:
            return newMessageAdd(state, action.total);

        default:
            return state;
    }
}
