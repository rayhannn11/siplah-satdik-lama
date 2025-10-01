import { CUSTOMER_ADD } from "./customerActionTypes";

const initialState = {
    showNotif:true
};

function addCustomer(state, customer) {
    if (customer !== state) {
        state = customer;
    }
    return state;
}

export default function customerReducer(state = initialState, action) {
    switch (action.type) {
        case CUSTOMER_ADD:
            return addCustomer(state, action.customer);
        default:
            return state;
    }
}
