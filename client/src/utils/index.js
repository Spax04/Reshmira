import { initializeState } from '../store/reducers/userReducer'
import AsyncStorage from '@react-native-async-storage/async-storage'


export const initializeAppState = () => async (dispatch) => {
  try {
    const userJson = await AsyncStorage.getItem('user')
    const tokenJson = await AsyncStorage.getItem('token')
    const user = userJson ? JSON.parse(userJson) : {}
    const token = tokenJson ? JSON.parse(tokenJson) : ''

    dispatch(initializeState({ ...user, token }))
  } catch (error) {
    console.error('Error initializing app state:', error)
    dispatch(initializeState({})) // initialize with empty state on error
  }
}