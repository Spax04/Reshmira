import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { COLORS, ROUTES, VARS } from '../../constants'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { setRoom } from '../../store/reducers/roomReducer'
import { useNavigation } from '@react-navigation/native'

const LobbyRoomScreen = ({ navigation }) => {
  const user = useSelector(state => state.user)
  const room = useSelector(state => state.room)
  const dispatch = useDispatch()
  const [errorMessage, setErrorMessage] = useState('')

  const handleCreateRoom = async () => {
    setErrorMessage('')

    try {
      const { data: createRoomResponse } = await axios.post(
        `${VARS.API_URL}/room/create`,
        {
          adminId: user._id
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      )

      if (createRoomResponse.success) {
        dispatch(setRoom(createRoomResponse.data))
        navigation.navigate(ROUTES.MANAGE_ROOM)
      } else {
        setErrorMessage(createRoomResponse.msg)
        console.warn(createRoomResponse.msg)
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.')
      console.error(error) // Make sure to log the error
    }
  }

  const handleJoinRoom = () => {
    // Navigate to the Join Room screen or handle join room logic
    // navigation.navigate(ROUTES.JOIN_ROOM)
  }

  useEffect(async () => {
    const storedRoom = await AsyncStorage.getItem('room')

    if (storedRoom) {
      const room = JSON.parse(storedRoom)
      dispatch(setRoom(room))

      if (user._id === room.adminId) {
        navigation.navigate(ROUTES.MANAGE_ROOM)
      } else {
        navigation.navigate(ROUTES.GUEST_ROOM)
      }
    }
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lobby</Text>
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text> // Display error message if it exists
      ) : null}
      <TouchableOpacity style={styles.button} onPress={handleCreateRoom}>
        <Text style={styles.buttonText}>Create Room</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleJoinRoom}>
        <Text style={styles.buttonText}>Join Room</Text>
      </TouchableOpacity>
    </View>
  )
}

export default LobbyRoomScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333'
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: COLORS.mainYellowL,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20
  },
  buttonText: {
    color: COLORS.mainDark,
    fontSize: 18,
    fontWeight: 'bold'
  },
  errorText: {
    color: 'red', // Set text color to red for error messages
    marginBottom: 20
  }
})
