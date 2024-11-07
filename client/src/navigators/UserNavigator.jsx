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
        headerShown: false
      }}
    >
      <Stack.Screen name={ROUTES.USER_PROFILE} component={UserProfile} />
      <Stack.Screen name={ROUTES.ADMIN_SETTINGS} component={AdminSettings}/>
    </Stack.Navigator>
  )
}

export default UserNavigator
