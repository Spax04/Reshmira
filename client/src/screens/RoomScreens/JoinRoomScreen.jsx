import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import axios from 'axios'
import { COLORS, VARS } from '../../constants'
import { useNavigation } from '@react-navigation/native'

const JoinRoomScreen = () => {
  const navigation = useNavigation() // Initialize the navigation hook
  const [roomCode, setRoomCode] = useState('')
  const [msg, setMsg] = useState('')
  const [infoMessage, setInfoMessage] = useState(false)

  const handleJoinRoom = async () => {
    if (roomCode.length !== 6) {
      setInfoMessage(false)
      setMsg('Room code must be 6 characters long.')
      return
    }

    try {
      const response = await axios.post(`${VARS.API_URL}/room/join`, {
        code: roomCode
      })

      if (!response.data.success) {
        setInfoMessage(false)
        setMsg(response.data.msg)
      } else {
        setInfoMessage(true)
        setMsg(response.data.msg)
       // navigation.navigate('RoomScreen') // Navigate to the room screen
      }
    } catch (error) {
      if (error.response) {
        console.error('Server Error:', error.response.data)
        setMsg('Server Error. Please try again later.')
      } else if (error.request) {
        console.error('No Response:', error.request)
        setMsg('No response from server. Please check your connection.')
      } else {
        console.error('Error:', error.message)
        setMsg('Error occurred while joining the room.')
      }
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backBtnText}>Back</Text>
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.title}>Join Room</Text>
        <TextInput
          style={styles.input}
          placeholder='Enter Room Code'
          maxLength={6}
          onChangeText={text => setRoomCode(text)}
        />
        <TouchableOpacity style={styles.button} onPress={handleJoinRoom}>
          <Text style={styles.buttonText}>Join Room</Text>
        </TouchableOpacity>
        {msg ? (
          <View
            style={[
              styles.messageContainer,
              { backgroundColor: infoMessage ? 'green' : 'red' }
            ]}
          >
            <Text style={styles.messageText}>{msg}</Text>
          </View>
        ) : null}
      </View>
    </View>
  )
}

export default JoinRoomScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent:'center',
    backgroundColor: '#f0f0f0', // Light background color for better contrast
  },
  backBtn: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5
  },
  backBtnText: {
    fontSize: 16,
    color: '#000'
  },
  content: {
    flex: 1,
    justifyContent: 'center', // Center align all items vertically
    alignItems: 'center', // Center align all items horizontally
    marginTop: 50,
    marginLeft:40,
    marginRight:40 // Added margin top for better visibility
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333'
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#EEE',
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.mainYellowL,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20
  },
  buttonText: {
    color: COLORS.mainDark,
    fontSize: 18,
    fontWeight: 'bold'
  },
  messageContainer: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 10,
    borderRadius: 5
  },
  messageText: {
    color: '#FFF',
    textAlign: 'center'
  }
})
