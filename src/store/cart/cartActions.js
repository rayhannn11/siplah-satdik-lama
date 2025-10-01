import { toast } from "react-toastify";
import customerApi from "../../api/customer";
import { FETCH_CART_LIST, FETCH_CART_LIST_SUCCESS, SET_OPTION_VALUE } from "../../data/constant";
import { addMiniCart } from "../mini-cart";

export function cartListFetch() {
    return {
        type: FETCH_CART_LIST,
    };
}

export function cartListFetchSuccess(options, token) {
    return (dispatch) =>
        customerApi.getCartList(options, token).then((res) => {
            dispatch(cartAddList(res.data));
        });
}

export function cartAddList(payload) {
    return {
        type: FETCH_CART_LIST_SUCCESS,
        payload,
    };
}

export function changeOptions(payload) {
    return {
        type: SET_OPTION_VALUE,
        payload,
    };
}

export function cartAddItem(product, token, quantity = 1, negoId, negoPrice, redirectToCart) {
    // sending request to server, timeout is used as a stub
    return (dispatch) =>
        customerApi
            .addCart({ productId: product.id, qty: quantity, negoId, negoPrice }, token)
            .then((res) => {
                const { status } = res;
                if (status.code === 200) {
                    toast.success(`Produk "${product.name}" berhasil ditambahkan ke keranjang`, { toastId: product.id });
                    customerApi.getMiniCart(token).then((res) => {
                        const { data } = res;
                        dispatch(addMiniCart(data));
                    });
                    dispatch(cartListFetchSuccess({ limit: 3, page: 1 }, token));
                    if (typeof redirectToCart == "function") {
                        redirectToCart();
                    }
                } else {
                    toast.error(status.message);
                }
            })
}

export function cartRemoveItem(product, token, cart) {
    // sending request to server, timeout is used as a stub
    return (dispatch) =>
        customerApi.deleteCart(product.id, token).then((res) => {
            customerApi.getMiniCart(token).then((res) => {
                const { data } = res;
                toast.success(`Produk "${product.name}" berhasil dihapus dari keranjang`);
                dispatch(addMiniCart(data));
            });
            dispatch(cartListFetchSuccess(cart.options, token));
            // dispatch(changeOptions(cart.options.page));
        });
}

export function cartQuantityUpdate(product, token, cart) {
    return (dispatch) =>
        customerApi.changeQuantity(product, token).then((res) => {
            customerApi.getMiniCart(token).then((res) => {
                const { data, status  } = res;
                dispatch(addMiniCart(data));
                console.log("resCart: ",res);
                console.log("statusCart: ", status.code);
                console.log("dataCart: ",data);
                if (status.code === 400) {
                    toast.error(status.code);
                }
            });
            dispatch(cartListFetchSuccess(cart.options, token));
            
        });
}
