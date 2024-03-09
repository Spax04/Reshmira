import { View, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { ROUTES } from '../constants';
import DrawerNavigator from './DrawerNavigator';
import {SignupScreen} from '../screens'

const Stack = createStackNavigator()
const AuthNavigator = () => {
  return (
    <Stack.Navigator> 
       <Stack.Screen name={ROUTES.SIGNUP} component={SignupScreen} /> 
    </Stack.Navigator>

  )
}

export default AuthNavigator