import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';

const EmptyList = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>הרשימה ריקה כרגע...</Text>
      <Image
        source={require('../../../assets/empty_list.png')}
        style={styles.img}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    padding: 16, // Add padding to avoid edge-to-edge layout
  },
  message: {
    fontSize: 28, // Increase font size for readability
    color: '#555', // Use a soft gray for the text
    textAlign: 'center', // Center the text
    marginBottom: 20, // Add space between the text and the image
    fontFamily: 'System', // Use system font or customize as needed
  },
  img: {
    width: 128, // Set a default width
    height: 128, // Set a default height
    opacity: 0.8, // Slight opacity for a subtle effect
  },
});

export default EmptyList;
