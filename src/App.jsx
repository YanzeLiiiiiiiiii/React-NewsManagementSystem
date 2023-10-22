import React from 'react'
import routes from './router'
import { useRoutes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store, persistor } from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'
export default function App() {
  const element = useRoutes(routes)
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}></PersistGate>
      {element}
    </Provider>
  )
}



