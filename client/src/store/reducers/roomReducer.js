import AsyncStorage from '@react-native-async-storage/async-storage'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  _id: '',
  secret: '',
  users: [],
  adminId: '',
  created_at: null,
  updated_at: null,
  schedule_id: null
}

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRoom: (state, action) => {
      state._id = action.payload._id
      state.secret = action.payload.secret
      state.users = action.payload.users
      state.adminId = action.payload.adminId
      state.scheduleId = action.payload.schedule_id
      state.createdAt = action.payload.created_at
      state.updatedAt = action.payload.updated_at

      const room = {
        _id: action.payload._id,
        secret: action.payload.secret,
        users: action.payload.users,
        adminId: action.payload.adminId,
        scheduleId: action.payload.schedule_id,
        createdAt: action.payload.created_at,
        updatedAt: action.payload.updated_at
      }

      // Store user data in AsyncStorage
      AsyncStorage.setItem('room', JSON.stringify(room))
        .then(() => console.log('Room data stored in AsyncStorage'))
        .catch(error => console.error('Error storing room:', error))
    },
    setRoomUsers: (state, action) => {

      state.users = action.payload
    }
  }
})

export const { setRoom, setRoomUsers } = roomSlice.actions

export default roomSlice.reducer
