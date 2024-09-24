import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  RefreshControl
} from 'react-native'
import axios from 'axios'
import { COLORS, ROUTES, VARS } from '../../constants'
import { removeRoom, setRoomUsers } from '../../store/reducers/roomReducer'
import { useDispatch, useSelector } from 'react-redux'

const ManagerRoomScreen = ({ navigation }) => {
  const [roomCode, setRoomCode] = useState('')
  const [msg, setMsg] = useState('')
  const [infoMessage, setInfoMessage] = useState(false)
  const [users, setUsers] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const room = useSelector(state => state.room)
  const user = useSelector(state => state.user)
  const [errorMessage, setErrorMessage] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    if (user._id === room.adminId && room.adminId !== '') {
      console.log('Correct admin')

      setUsers(room.users)
      setRoomCode(room.secret)
    } else {
      navigation.navigate(ROUTES.LOBBY_ROOM)
    }
  }, [])

  const handleDeleteRoom = async () => {
    setErrorMessage('')
    dispatch(removeRoom())
    navigation.navigate(ROUTES.LOBBY_ROOM)

    try {
      const { data: roomDeleteResponse } = await axios.post(
        `${VARS.API_URL}/room/delete`,
        { roomId: room._id },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      )
      console.log(roomDeleteResponse)

      if (!roomDeleteResponse.success) {
        setErrorMessage(roomDeleteResponse.msg)
      } else {
        navigation.navigate(ROUTES.LOBBY_ROOM)
      }
    } catch {}
  }

  const handleCreateSchedule = () => {
    // navigation.navigate('CreateScheduleScreen') // Navigate to the schedule creation screen
  }

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      const { data: usersByRoomIdResponse } = await axios.get(
        `${VARS.API_URL}/room/${room._id}/users`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      )
      if (usersByRoomIdResponse.success) {
        setUsers(usersByRoomIdResponse.data)
        dispatch(setRoomUsers(usersByRoomIdResponse.data))
      } else {
        setMsg('Failed to refresh users.')
      }
    } catch (error) {
      console.error('Error refreshing users:', error)
      setMsg('Error occurred while refreshing users.')
    }
    setRefreshing(false)
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text> // Display error message if it exists
        ) : null}

        {roomCode ? (
          <Text style={styles.roomCode}>Room Code: {roomCode}</Text>
        ) : null}
        <TouchableOpacity style={styles.button} onPress={handleCreateSchedule}>
          <Text style={styles.buttonText}>Create Schedule</Text>
        </TouchableOpacity>
        {roomCode ? (
          <>
            <Text style={styles.usersHeader}>
              Connected Users ({users.length}) :
            </Text>
            <FlatList
              data={users}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.userItem}>
                  <Text style={styles.userName}>{item}</Text>
                </View>
              )}
              ListEmptyComponent={<Text>No Users Connected</Text>}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          </>
        ) : null}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteRoom}
        >
          <Text style={styles.deleteButtonText}>Delete Room</Text>
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

export default ManagerRoomScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    marginLeft: 40,
    marginRight: 40
  },
  roomCode: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#555'
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
  deleteButton: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.mainRed,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20
  },
  deleteButtonText: {
    color: COLORS.whiteText,
    fontSize: 18,
    fontWeight: 'bold'
  },
  buttonText: {
    color: COLORS.mainDark,
    fontSize: 18,
    fontWeight: 'bold'
  },
  usersHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#444'
  },
  userItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2
  },
  userName: {
    fontSize: 18,
    color: '#555'
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
  },
  errorText: {
    color: 'red', // Set text color to red for error messages
    marginBottom: 20
  }
})
