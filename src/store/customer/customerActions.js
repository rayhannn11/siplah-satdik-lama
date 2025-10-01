import { CUSTOMER_ADD } from "./customerActionTypes";

export function customerAdd(customer) {
    return {
        type: CUSTOMER_ADD,
        customer,
    };
}
