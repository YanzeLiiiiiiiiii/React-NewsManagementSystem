
const collapsedReducer = (prevState = { isCollapse: false }, action) => {
    const { type } = action
    switch (type) {
        case 'ChangeState':
            let newState = { ...prevState }
            newState.isCollapse = !newState.isCollapse
            return newState
        default:
            return prevState
    }
}
export default collapsedReducer