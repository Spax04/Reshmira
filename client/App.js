import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./src/navigators/AuthNavigator";
import { Provider } from "react-redux";
import store from "./src/store";
import Initializer from "./src/utils/Initializer"; // Update the path accordingly
import { ToastProvider } from "react-native-toast-notifications";
import { navigationRef } from "./src/utils/navigationService";
import { I18nManager } from 'react-native';

export default function App() {

// Enable RTL layout if not already enabled
if (!I18nManager.isRTL) {
  I18nManager.forceRTL(true);
  // Optionally reload the app for the layout changes to take effect
}
  return (
    <ToastProvider>
      <Provider store={store}>
        <Initializer>
          <View style={styles.container}>
            <NavigationContainer ref={navigationRef}>
              <AuthNavigator />
            </NavigationContainer>
          </View>
        </Initializer>
      </Provider>
    </ToastProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
