import { legacy_createStore, combineReducers } from 'redux'
import collapsedReducer from './reducers/collapsedReducer'
import loadingReducer from './reducers/loadingReducer'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['loadingReducer']
}
const combineRecuer = combineReducers({
    collapsedReducer,
    loadingReducer
})

const persistedReducer = persistReducer(persistConfig, combineRecuer)
const store = legacy_createStore(persistedReducer)
let persistor = persistStore(store)
export {
    store,
    persistor
}