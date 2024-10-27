import {
  applyMiddleware,
  combineReducers,
  configureStore
} from '@reduxjs/toolkit'

import userReducer from './reducers/userReducer'
import roomReducer from './reducers/roomReducer'
import scheduleReducer from './reducers/scheduleReducer'

export default configureStore({
  reducer: {
    user: userReducer,
    room: roomReducer,
    schedule: scheduleReducer
  }
})
