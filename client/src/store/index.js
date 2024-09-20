import {
  applyMiddleware,
  combineReducers,
  configureStore
} from '@reduxjs/toolkit'

import userReducer from './reducers/userReducer'
import roomReducer from './reducers/roomReducer'

export default configureStore({
  reducer: {
    user: userReducer,
    room: roomReducer
  }
})
