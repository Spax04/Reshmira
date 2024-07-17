import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';

const UserComponent = ({ user, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.userContainer}>
      <Text style={styles.userName}>{user.fullName}</Text>
    </TouchableOpacity>
  );
};

export default UserComponent;

const styles = StyleSheet.create({
  userContainer: {
    marginRight: 8,
  },
  userName: {
    fontSize: 14,
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
});
