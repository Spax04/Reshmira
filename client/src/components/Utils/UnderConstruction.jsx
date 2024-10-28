import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const UnderConstruction = ({ 
  message = "This feature is currently under development. Please check back later!",
  subMessage = "Thank you for your patience!" 
}) => {
  return (
    <View style={styles.container}>
      <MaterialIcons name="construction" size={64} color="#FFAA00" style={styles.icon} />
      <ActivityIndicator size="large" color="#00adf5" style={styles.spinner} />
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.subMessage}>{subMessage}</Text>
    </View>
  );
};

export default UnderConstruction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  message: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginTop: 20, // Space between the spinner and the message
  },
  subMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666', // Slightly lighter for contrast
    marginTop: 8, // Space between the message and the sub-message
  },
  spinner: {
    marginTop: 10, // Add some space between the icon and the spinner
  },
  icon: {
    shadowColor: "#000", // Add shadow for a more dynamic look
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});
