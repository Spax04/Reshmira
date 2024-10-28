import { StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DayComponent from '../../components/GroupShiftsSchedule/DayComponent';
import moment from 'moment';

const GroupShifts = ({ navigation }) => {
  const schedule = useSelector((state) => state.schedule);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    if (schedule.shifts && schedule.shifts.length > 0) {
      console.log(schedule.shifts[0].guard_posts[0]);
    }
  }, [schedule.shifts]);

  // Group shifts by day
  const shiftsByDay = schedule.shifts?.reduce((acc, shift) => {
    const formattedDate = moment(shift.start_time).format('dddd, MMMM Do');
    const startTime = moment(shift.start_time).format('HH:mm');
    const endTime = moment(shift.end_time).format('HH:mm');

    const formattedShift = {
      startTime,
      endTime,
      positions: shift.guard_posts?.map((post) => ({
        position_name: post.position_name,
        guards: post.guards,
        guards_pre_position: post.guards.length,
      })) || []
    };

    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }
    acc[formattedDate].push(formattedShift);

    return acc;
  }, {});

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator animating={loading} size="large" />
      ) : (
        <ScrollView>
          {Object.entries(shiftsByDay).map(([date, shifts]) => (
            <DayComponent key={date} date={date} shifts={shifts} navigation={navigation} />
          ))}
        </ScrollView>
      )}
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
