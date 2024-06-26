import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import AuthNavigator from './src/navigators/AuthNavigator'

export default function App () {
  return (
    <View style={styles.container}>
     
      <NavigationContainer>
        <AuthNavigator /> 
      </NavigationContainer>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
   
  }
})
