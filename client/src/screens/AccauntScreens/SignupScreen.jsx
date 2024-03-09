import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const SignupScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>SignupScreen</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#000',
    fontSize: 24, // Adjust font size as needed
  },
})

export default SignupScreen
