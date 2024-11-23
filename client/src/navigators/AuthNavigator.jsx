import { View, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { ROUTES } from '../constants'
import DrawerNavigator from './DrawerNavigator'
import { ForgotScreen, LoginScreen, SignupScreen } from '../screens'
import UserNavigator from './UserNavigator'
import VerificationEmailScreen from '../screens/AuthScreens/ForgotPassword/VerificationEmailScreen'
import ResetPasswordScreen from '../screens/AuthScreens/ForgotPassword/ResetPasswordScreen'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'

const Stack = createStackNavigator()
const AuthNavigator = () => {

  const navigation = useNavigation()
  const user = useSelector(state => state.user)

  useEffect(()=>{
    console.log("CHECK USER ON LOGIN");
    console.log(user._id);
    if(user._id !== ""){
      navigation.navigate(ROUTES.HOME)
    }
  },[user._id])
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false
      }}
      initialRouteName={ROUTES.LOGIN}
    >
      <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
      <Stack.Screen name={ROUTES.SIGNUP} component={SignupScreen} />
      <Stack.Screen name={ROUTES.FORGOT_PASSWORD} component={ForgotScreen} />
      <Stack.Screen name={ROUTES.VERIFY_EMAIL} component={VerificationEmailScreen} />
      <Stack.Screen name={ROUTES.RESET_PASSWORD} component={ResetPasswordScreen} />
      <Stack.Screen name={ROUTES.HOME} component={DrawerNavigator} />
      <Stack.Screen name={ROUTES.USER_STACK} component={UserNavigator}/>
    </Stack.Navigator>
  )
}

export default AuthNavigator
