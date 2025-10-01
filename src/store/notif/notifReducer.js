const initialState = false;


const notifReducer = (state = initialState,action) => {
    switch (action.type) {
        case 'OPEN_NOTIF':
            return state = true
        case 'CLOSE_NOTIF':
            return state = false
        default:
            return state
    }
}

export default notifReducer