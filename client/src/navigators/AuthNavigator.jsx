import { View, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { ROUTES } from '../constants'
import DrawerNavigator from './DrawerNavigator';
import { ForgotScreen, LoginScreen, SignupScreen } from '../screens'

const Stack = createStackNavigator()
const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
      initialRouteName={ROUTES.LOGIN}
    >
      <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
      <Stack.Screen name={ROUTES.SIGNUP} component={SignupScreen} />
      <Stack.Screen name={ROUTES.FORGOT_PASSWORD} component={ForgotScreen} />
      <Stack.Screen name={ROUTES.HOME} component={DrawerNavigator} />
    </Stack.Navigator>
  )
}

export default AuthNavigator
