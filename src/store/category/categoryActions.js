import { CATEGORY_ADD_LIST } from "./categoryActionTypes";

export function categoryAdd(category) {
    return {
        type: CATEGORY_ADD_LIST,
        payload: category,
    };
}
