import { StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import AuthNavigator from './src/navigators/AuthNavigator'
import { Provider } from 'react-redux'
import store from './src/store'
import Initializer from './src/utils/Initializer' // Update the path accordingly

export default function App () {
  return (
    <Provider store={store}>
      <Initializer>
        <View style={styles.container}>
          <NavigationContainer>
            <AuthNavigator />
          </NavigationContainer>
        </View>
      </Initializer>
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
})
