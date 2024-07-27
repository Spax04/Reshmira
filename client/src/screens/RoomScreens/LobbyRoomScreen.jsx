import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import { COLORS, ROUTES } from '../../constants'

const LobbyRoomScreen = ({ navigation }) => {
  const handleCreateRoom = () => {
    // Navigate to the Create Room screen or handle create room logic
    navigation.navigate(ROUTES.CREATE_ROOM)
  }

  const handleJoinRoom = () => {
    // Navigate to the Join Room screen or handle join room logic
    navigation.navigate(ROUTES.JOIN_ROOM)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lobby</Text>
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
  }
})
