import AsyncStorage from '@react-native-async-storage/async-storage'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token: '',
  _id: '',
  fullName: '',
  role: 'none',
  scheduleId: null,
  shifts: []
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state._id = action.payload._id
      state.fullName = action.payload.fullName
      state.role = action.payload.role
      state.scheduleId = action.payload.scheduleId
      state.shifts = [...action.payload.shifts]

      const user = {
        _id: action.payload._id,
        fullName: action.payload.fullName,
        role: action.payload.role,
        scheduleId: action.payload.scheduleId,
        shifts: [...action.payload.shifts]
      }

      // Store user data in AsyncStorage
      AsyncStorage.setItem('user', JSON.stringify(user))
        .then(() => console.log('User stored in AsyncStorage'))
        .catch(error => console.error('Error storing user:', error))
    },
    setUserToken: (state, action) => {
      state.token = action.payload
      AsyncStorage.setItem('token', JSON.stringify(action.payload))
        .then(() => console.log('Token stored in AsyncStorage'))
        .catch(error => console.error('Error storing token:', error))
    },
    removeUser: state => {
      state.token = ''
      state._id = ''
      state.fullName = ''
      state.role = 'none'
      state.scheduleId = null
      state.shifts = []
      // Remove user data from AsyncStorage
      AsyncStorage.removeItem('user')
        .then(() => console.log('User removed from AsyncStorage'))
        .catch(error => console.error('Error removing user:', error))
    },
    initializeState: (state, action) => {
      state.token = action.payload.token || ''
      state._id = action.payload._id || ''
      state.fullName = action.payload.fullName || ''
      state.role = action.payload.role || 'none'
      state.scheduleId = action.payload.scheduleId || null
      state.shifts = action.payload.shifts || []
    }
  }
})

export const { setUser, removeUser, setUserToken, initializeState } = userSlice.actions

export default userSlice.reducer
