import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import ShiftComponent from './ShiftComponent'; // Adjust the path as necessary

const DayComponent = ({ date, shifts, navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.dayText}>{date}</Text>
      {shifts.map((shift, index) => (
        <ShiftComponent
          key={index}
          startTime={shift.startTime}
          endTime={shift.endTime}
          positions={shift.positions}
          date={date}
          navigation={navigation} 
        />
      ))}
    </View>
  );
};

export default DayComponent;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  dayText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
