import { View, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { ROUTES } from '../constants'
import UserProfile from '../screens/CommonScreens/UserProfile'
import AdminSettings from '../screens/CommonScreens/AdminSettings'

const Stack = createStackNavigator()
const UserNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true
      }}
    >
      <Stack.Screen options={{title: "User settings"}} name={ROUTES.USER_PROFILE} component={UserProfile} />
      <Stack.Screen options={{title: "Schedule settings"}} name={ROUTES.ADMIN_SETTINGS} component={AdminSettings}/>
    </Stack.Navigator>
  )
}

export default UserNavigator
