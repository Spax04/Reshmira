import { StyleSheet, View, ScrollView } from 'react-native';
import React from 'react';
import DayComponent from '../../components/GroupShiftsSchedule/DayComponent'; // Adjust the path as necessary

const GroupShifts = ({ navigation }) => {
  const shiftsByDay = {
    'Monday, January 1st': [
      {
        startTime: '08:00',
        endTime: '12:00',
        positions: [
          { 
            name: 'Position A', 
            assigned: [
              { fullName: 'John Doe' },
              { fullName: 'Jane Smith' },
            ] 
          },
        ],
      },
      {
        startTime: '13:00',
        endTime: '17:00',
        positions: [
          { 
            name: 'Position B', 
            assigned: [
              { fullName: 'Alice Brown' },
              { fullName: 'Charlie Davis' },
            ] 
          },
        ],
      },
    ],
    'Tuesday, January 2nd': [
      {
        startTime: '09:00',
        endTime: '13:00',
        positions: [
          { 
            name: 'Position A', 
            assigned: [
              { fullName: 'Eve Johnson' },
              { fullName: 'Frank Lee' },
            ] 
          },
        ],
      },
      {
        startTime: '14:00',
        endTime: '18:00',
        positions: [
          { 
            name: 'Position B', 
            assigned: [
              { fullName: 'Grace Miller' },
              { fullName: 'Hank Green' },
            ] 
          },
        ],
      },
    ],
    'Wednesday, January 3rd': [
      {
        startTime: '10:00',
        endTime: '14:00',
        positions: [
          { 
            name: 'Position A', 
            assigned: [
              { fullName: 'Ivy Black' },
              { fullName: 'Jack White' },
            ] 
          },
        ],
      },
      {
        startTime: '15:00',
        endTime: '19:00',
        positions: [
          { 
            name: 'Position B', 
            assigned: [
              { fullName: 'Kelly Blue' },
              { fullName: 'Larry Red' },
            ] 
          },
        ],
      },
    ],
    'Thursday, January 4th': [
      {
        startTime: '11:00',
        endTime: '15:00',
        positions: [
          { 
            name: 'Position A', 
            assigned: [
              { fullName: 'Megan Silver' },
              { fullName: 'Nina Gold' },
            ] 
          },
        ],
      },
      {
        startTime: '16:00',
        endTime: '20:00',
        positions: [
          { 
            name: 'Position B', 
            assigned: [
              { fullName: 'Oliver Brown' },
              { fullName: 'Paul White' },
            ] 
          },
        ],
      },
    ],
    'Friday, January 5th': [
      {
        startTime: '12:00',
        endTime: '16:00',
        positions: [
          { 
            name: 'Position A', 
            assigned: [
              { fullName: 'Quincy Red' },
              { fullName: 'Rachel Blue' },
            ] 
          },
        ],
      },
      {
        startTime: '17:00',
        endTime: '21:00',
        positions: [
          { 
            name: 'Position B', 
            assigned: [
              { fullName: 'Steve Green' },
              { fullName: 'Tina Black' },
            ] 
          },
        ],
      },
    ],
    'Saturday, January 6th': [
      {
        startTime: '13:00',
        endTime: '17:00',
        positions: [
          { 
            name: 'Position A', 
            assigned: [
              { fullName: 'Uma White' },
              { fullName: 'Victor Blue' },
            ] 
          },
        ],
      },
      {
        startTime: '18:00',
        endTime: '22:00',
        positions: [
          { 
            name: 'Position B', 
            assigned: [
              { fullName: 'Wendy Green' },
              { fullName: 'Xander Black' },
            ] 
          },
        ],
      },
    ],
    'Sunday, January 7th': [
      {
        startTime: '14:00',
        endTime: '18:00',
        positions: [
          { 
            name: 'Position A', 
            assigned: [
              { fullName: 'Yvonne White' },
              { fullName: 'Zachary Blue' },
            ] 
          },
        ],
      },
      {
        startTime: '19:00',
        endTime: '23:00',
        positions: [
          { 
            name: 'Position B', 
            assigned: [
              { fullName: 'Amy Green' },
              { fullName: 'Brian Black' },
            ] 
          },
        ],
      },
    ],
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {Object.entries(shiftsByDay).map(([date, shifts]) => (
          <DayComponent key={date} date={date} shifts={shifts} navigation={navigation} />
        ))}
      </ScrollView>
    </View>
  );
};

export default GroupShifts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
});
