import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const UserComponent = ({ user, onPress }) => {
  const userState = useSelector((state) => state.user);
  const [selfUser, setSelfUser] = useState(false);

  useEffect(() => {
    if (user._id === userState._id) {
      setSelfUser(true);
    } else {
      setSelfUser(false);
    }
  }, [user, userState._id]);

  return (
    <TouchableOpacity
      style={[styles.user, selfUser ? styles.selfUser : null]} // Apply selfUser style if it's the current user
      onPress={onPress}
    >
      <Text style={styles.userText}>{user.fullName}</Text>
    </TouchableOpacity>
  );
};

export default UserComponent;

const styles = StyleSheet.create({
  user: {
    marginRight: 8,
    marginBottom: 4,
    padding: 6,
    borderRadius: 4,
    backgroundColor: '#e0e0e0', // Default background color
  },
  selfUser: {
    backgroundColor: '#a2d5f2', // Special background color for the current user
    borderWidth: 1,
    borderColor: '#4b9cd3', // Optional: add border color for more distinction
  },
  userText: {
    fontSize: 12,
    color: '#333',
  },
});
