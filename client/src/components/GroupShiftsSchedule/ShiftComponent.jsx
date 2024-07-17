import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import UserComponent from './UserComponent' // Adjust the path as necessary
import { ROUTES } from '../../constants'

const ShiftComponent = ({
  date,
  startTime,
  endTime,
  positions,
  navigation
}) => {
  const handleUserPress = (user) => {
    navigation.navigate(ROUTES.USER_STACK, {
      screen: ROUTES.USER_PROFILE,
      params: { user }
    }) // Navigate to UserProfile with user data
  }

  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>{date}</Text>
      <Text style={styles.timeText}>
        {startTime} - {endTime}
      </Text>
      {positions.map((position, index) => (
        <View key={index}>
          <Text style={styles.positionText}>{position.name}:</Text>
          <View style={styles.userContainer}>
            {position.assigned.map((user, userIndex) => (
              <UserComponent
                key={userIndex}
                user={user}
                onPress={() => handleUserPress(user)} // Call the updated function
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  )
}

export default ShiftComponent

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2
  },
  dateText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#555'
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  positionText: {
    fontSize: 14,
    marginTop: 4
  },
  userContainer: {
    flexDirection: 'row',
    marginTop: 4
  }
})
