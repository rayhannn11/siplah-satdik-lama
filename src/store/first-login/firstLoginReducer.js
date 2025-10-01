const initialState = true;


const firstLoginReducer = (state = initialState,action) => {
    switch (action.type) {
        case 'CHANGE_STATUS':
            return state = false
        case 'RESET_STATUS':
            return state = true
        default:
            return state
    }
}

export default firstLoginReducer