
const loadingReducer = (prevState = { isLoading: false }, action) => {
    let { type, state } = action
    switch (type) {
        case 'ChangeLoading':
            let newState = { ...prevState }
            newState.isLoading = state
            return newState
        default:
            return prevState
    }
}
export default loadingReducer