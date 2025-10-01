import { CHECKOUT_ADD_ITEM, CHECKOUT_REMOVE_ITEM } from "./checkoutActionTypes";

export const addCheckout = (payload) => ({ type: CHECKOUT_ADD_ITEM, payload });

export const removeCheckout = () => ({ type: CHECKOUT_REMOVE_ITEM });
