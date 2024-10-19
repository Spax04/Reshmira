import { View, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { ROUTES } from '../constants'
import { CreateRoomScreen, GuestLobbyRoomScreen, JoinRoomScreen, LobbyRoomScreen, } from '../screens'
import UserNavigator from './UserNavigator'
import ManagerRoomScreen from '../screens/RoomScreens/ManagerRoomScreen'

const Stack = createStackNavigator()
const RoomNavigator = () => {
  return (
    <Stack.Navigator
      name={ROUTES.ROOM_STACK}
      screenOptions={{
        headerShown: false,
        gestureEnabled: false
      }}

      initialRouteName={ROUTES.LOBBY_ROOM}
    >
      <Stack.Screen name={ROUTES.LOBBY_ROOM} options={{ gestureEnabled: false }} component={LobbyRoomScreen} />
      <Stack.Screen name={ROUTES.MANAGE_ROOM} options={{ gestureEnabled: false }} component={ManagerRoomScreen} />
      <Stack.Screen name={ROUTES.JOIN_ROOM} options={{ gestureEnabled: false }} component={JoinRoomScreen} />
      <Stack.Screen name={ROUTES.GUEST_ROOM} options={{ gestureEnabled: false }} component={GuestLobbyRoomScreen} />
    </Stack.Navigator>
  )
}

export default RoomNavigator
