import { View, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { ROUTES } from '../constants'
import DrawerNavigator from './DrawerNavigator'
import { CreateRoomScreen,  JoinRoomScreen, LobbyRoomScreen,} from '../screens'
import UserNavigator from './UserNavigator'

const Stack = createStackNavigator()
const RoomNavigator = () => {
  return (
    <Stack.Navigator
    name={ROUTES.ROOM_STACK}
      screenOptions={{
        headerShown: false
      }}
      initialRouteName={ROUTES.LOBBY_ROOM}
    >
      <Stack.Screen name={ROUTES.LOBBY_ROOM} component={LobbyRoomScreen} />
      <Stack.Screen name={ROUTES.CREATE_ROOM} component={CreateRoomScreen} />
      <Stack.Screen name={ROUTES.JOIN_ROOM} component={JoinRoomScreen} />
      
    </Stack.Navigator>
  )
}

export default RoomNavigator
