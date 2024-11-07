import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { Button } from 'react-native-elements'
import { ROUTES } from '../../constants'

// Example mock data
const shiftsByDay = {
  'Monday, January 1st': [
    {
      date: 'Monday, January 1st', // Added date directly to the shift for better handling
      startTime: '08:00',
      endTime: '12:00',
      positions: [
        {
          name: 'Position A',
          assigned: [{ fullName: 'John Doe' }, { fullName: 'Jane Smith' }]
        }
      ]
    },
    {
      date: 'Monday, January 1st', // Added date directly to the shift for better handling
      startTime: '13:00',
      endTime: '17:00',
      positions: [
        {
          name: 'Position B',
          assigned: [{ fullName: 'John Doe' }, { fullName: 'Alice Brown' }]
        }
      ]
    }
  ],
  'Tuesday, January 2nd': [
    {
      date: 'Tuesday, January 2nd', // Added date directly to the shift for better handling
      startTime: '09:00',
      endTime: '13:00',
      positions: [
        {
          name: 'Position C',
          assigned: [{ fullName: 'John Doe' }, { fullName: 'Bob White' }]
        }
      ]
    }
  ],
  'Wednesday, January 3rd': [
    {
      date: 'Wednesday, January 3rd', // Added date directly to the shift for better handling
      startTime: '10:00',
      endTime: '14:00',
      positions: [
        {
          name: 'Position D',
          assigned: [{ fullName: 'John Doe' }, { fullName: 'David Green' }]
        }
      ]
    }
  ]
}

const UserProfile = ({ route, navigation }) => {
  const user = route.params?.user || {}
  user.shifts = Object.keys(shiftsByDay).flatMap(date =>
    shiftsByDay[date].map(shift => ({ ...shift }))
  )

  return (
    <View style={styles.container}>
      <View style={styles.content}>
      <Button title="Back" type="outline" onPress={navigation.navigate(ROUTES.HOME)} />
        <Text style={styles.nameText}>{user.full_name}</Text>
        <Text style={styles.shiftsHeader}>Shifts:</Text>
        <FlatList
          data={user.shifts} // Use the user's shifts data
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.shiftItem}>
              <Text style={styles.shiftDate}>{item.date}</Text>
              <Text style={styles.shiftTime}>
                {item.startTime} - {item.endTime}
              </Text>
            </View>
          )}
          ListEmptyComponent={<Text>No Shifts Available</Text>} // Display message if no shifts are available
        />
      </View>
    </View>
  )
}

export default UserProfile

const styles = StyleSheet.create({
  backBtn: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5
  },
  backBtnText: {
    fontSize: 16,
    color: '#000'
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0', // Light background color for better contrast
    marginTop: 50 // Added margin top for better visibility
  },
  content: {
    flex: 1,
    alignItems: 'center', // Center align all items horizontally
    justifyContent: 'center', // Center align all items vertically
  },
  nameText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20
  },
  shiftsHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 10
  },
  shiftItem: {
    backgroundColor: '#fff', // White background for the shift item
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2
  },
  shiftDate: {
    fontSize: 18,
    color: '#555',
    marginBottom: 5
  },
  shiftTime: {
    fontSize: 16,
    color: '#777'
  }
})
