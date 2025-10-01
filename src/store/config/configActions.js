import { CONFIG_CHANGE } from "./configActionTypes";

export const configChange = (config) => ({
    type:CONFIG_CHANGE,
    payload:config
})