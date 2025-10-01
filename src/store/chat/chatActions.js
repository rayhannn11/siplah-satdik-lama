import { CHAT_ADD_LIST } from './chatActionTypes'
export const addChatList = (messages) => {
    return {
        type: CHAT_ADD_LIST,
        chatList: messages
    }
}