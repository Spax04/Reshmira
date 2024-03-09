import { StyleSheet, Text, View ,Button} from 'react-native'
import React from 'react'
import { ROUTES } from '../../constants'

const LoginScreen = () => {
  return (
    <View>
      <Text>LoginScreen</Text>
      {/* <Button title="Log In" onPress={() => navigation.navigate(ROUTES.HOME)} />
      <Button
        title="Go to Signup screen"
        onPress={() => navigation.navigate(ROUTES.SIGNUP)}
      /> */}
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({})