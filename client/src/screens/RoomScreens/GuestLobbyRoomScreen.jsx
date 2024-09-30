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
import { useDispatch, useSelector } from 'react-redux'
import { removeRoom, setRoomUsers } from '../../store/reducers/roomReducer'
import { useToast } from 'react-native-toast-notifications'

const GuestLobbyRoomScreen = ({ navigation }) => {
  const toast = useToast()

  const [roomCode, setRoomCode] = useState('')
  const [users, setUsers] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const room = useSelector(state => state.room)
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    if (room._id) {
      setUsers(room.users)
      setRoomCode(room.secret)
    } else {
      navigation.navigate(ROUTES.LOBBY_ROOM)
    }
  }, [])

  const handleLeaveRoom = async () => {

    try {
      const { data: leaveRoomResponse } = await axios.post(
        `${VARS.API_URL}/room/leave`,
        { roomId: room._id },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      )

      if (leaveRoomResponse.success) {
        dispatch(removeRoom())
        navigation.navigate(ROUTES.LOBBY_ROOM)
      } else {
        toast.show(leaveRoomResponse.msg, {
          type: 'danger',
          placement: 'bottom',
          duration: 4000,
          offset: 30,
          animationType: 'slide-in'
        })
      }
    } catch (error) {
      toast.show('Error leaving the room.', {
        type: 'danger',
        placement: 'bottom',
        duration: 4000,
        offset: 30,
        animationType: 'slide-in'
      })
    }
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
        if (usersByRoomIdResponse.data === null) {
          toast.show('Room has been delted by Admin', {
            type: 'warning',
            placement: 'bottom',
            duration: 4000,
            offset: 30,
            animationType: 'slide-in'
          })

          navigation.navigate(ROUTES.LOBBY_ROOM)
        }
        toast.show('Error on refresh users', {
          type: 'danger',
          placement: 'bottom',
          duration: 4000,
          offset: 30,
          animationType: 'slide-in'
        })
      }
    } catch (error) {
      console.error('Error refreshing users:', error)
      toast.show('Error occurred while refreshing users.', {
        type: 'danger',
        placement: 'bottom',
        duration: 4000,
        offset: 30,
        animationType: 'slide-in'
      })
    }
    setRefreshing(false)
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>

        {roomCode ? (
          <Text style={styles.roomCode}>Room Code: {roomCode}</Text>
        ) : null}

        {roomCode ? (
          <>
            <Text style={styles.usersHeader}>
              Participants ({users.length}) :
            </Text>
            <FlatList
              data={users}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.userItem}>
                  <Text style={styles.userName}>{item}</Text>
                </View>
              )}
              ListEmptyComponent={<Text>No Participants Connected</Text>}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          </>
        ) : null}

        <TouchableOpacity style={styles.leaveButton} onPress={handleLeaveRoom}>
          <Text style={styles.leaveButtonText}>Leave Room</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default GuestLobbyRoomScreen

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
  leaveButton: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.mainRed,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20
  },
  leaveButtonText: {
    color: COLORS.whiteText,
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
    color: 'red',
    marginBottom: 20
  }
})
