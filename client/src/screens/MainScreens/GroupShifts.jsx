import { StyleSheet, View, ScrollView } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import DayComponent from '../../components/GroupShiftsSchedule/DayComponent';
import moment from 'moment'; // Assuming you have moment.js to handle date formatting
import { ROUTES } from '../../constants';

const GroupShifts = ({ navigation }) => {

  // Retrieve shifts data from Redux store
  const schedule = useSelector((state) => state.schedule);
  
  useState(() => {
    console.log("SCHEDULE ID" + schedule._id);
    if (schedule._id == "")
      navigation.navigate(ROUTES.HOME)
  },[])
  // Transform the shift data
  // const shiftsByDay = schedule.shifts.reduce((acc, shift) => {
  //   // Format start date to match your desired date structure (e.g., "Monday, January 1st")
  //   const formattedDate = moment(shift.start_time).format('dddd, MMMM Do');

  //   // Structure the shift data to match previous structure
  //   const formattedShift = {
  //     startTime: moment(shift.start_time).format('HH:mm'),
  //     endTime: moment(shift.end_time).format('HH:mm'),
  //     positions: shift.guard_posts.map((post) => ({
  //       name: post.position_name,
  //     })),
  //   };

  //   // Group shifts by formattedDate
  //   if (!acc[formattedDate]) {
  //     acc[formattedDate] = [];
  //   }
  //   acc[formattedDate].push(formattedShift);

  //   return acc;
  // }, {});

  return (
    <View style={styles.container}>
      {/* <ScrollView>
        {Object.entries(shiftsByDay).map(([date, shifts]) => (
          <DayComponent key={date} date={date} shifts={shifts} navigation={navigation} />
        ))}
      </ScrollView> */}
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
