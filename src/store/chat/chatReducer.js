import { CHAT_ADD_LIST } from './chatActionTypes'

const initialState = {
    chatList: []
}

export default function chatReducer(state = initialState, action) {
    switch (action.type) {
        case CHAT_ADD_LIST:
            return {
                ...state,
                chatList: action.chatList,
            };
        default:
            return state
    }
}