import shopApi from "../../api/shop";
import { QUICKVIEW_CLOSE, QUICKVIEW_OPEN } from "./quickviewActionTypes";

let cancelPreviousRequest = () => { };

export function quickviewOpenSuccess(product) {
    return {
        type: QUICKVIEW_OPEN,
        product,
    };
}

export function quickviewClose() {
    return {
        type: QUICKVIEW_CLOSE,
    };
}

export function quickviewOpen(productSlug, mallId, token) {
    return (dispatch) => {
        cancelPreviousRequest();

        return new Promise((resolve) => {
            let canceled = false;
            // sending request to server, timeout is used as a stub
            const timer = setTimeout(() => {
                shopApi.getProductBySlug(productSlug, mallId, token).then((product) => {
                    if (canceled) {
                        return;
                    }

                    if (product) {
                        dispatch(quickviewOpenSuccess(product.data));
                    }

                    resolve();
                });
            }, 350);

            cancelPreviousRequest = () => {
                canceled = true;
                clearTimeout(timer);
                resolve();
            };
        });
    };
}
