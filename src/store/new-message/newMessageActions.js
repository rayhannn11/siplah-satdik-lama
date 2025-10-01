import { NEW_MESSAGE_ADD } from "./newMessageActionTypes";

export function newMessageAdd(total) {
    return {
        type: NEW_MESSAGE_ADD,
        total,
    };
}
