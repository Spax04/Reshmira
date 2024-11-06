import { StyleSheet, View, ScrollView, ActivityIndicator, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DayComponent from '../../components/GroupShiftsSchedule/DayComponent';
import moment from 'moment';

const UsersShifts = ({ navigation }) => {
  const schedule = useSelector((state) => state.schedule);
  const user = useSelector((state) => state.user);
  const [userShiftsByDay, setUserShiftsByDay] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (schedule.shifts && user._id) {
      // Filter shifts where the user appears
      const filteredShifts = schedule.shifts.filter((shift) =>
        shift.guard_posts.some((post) =>
          post.guards.some((guardId) => guardId._id.toString() === user._id.toString())
        )
      );

      // Group user-specific shifts by day
      const shiftsByDay = filteredShifts.reduce((acc, shift) => {
        const formattedDate = moment(shift.start_time).format('dddd, MMMM Do');
        const startTime = moment(shift.start_time).format('HH:mm');
        const endTime = moment(shift.end_time).format('HH:mm');

        const formattedShift = {
          startTime,
          endTime,
          positions: shift.guard_posts
            .map((post) => ({
              position_name: post.position_name,
              guards: post.guards,
              guards_pre_position: post.guards.length,
            })),
        };

        if (!acc[formattedDate]) {
          acc[formattedDate] = [];
        }
        acc[formattedDate].push(formattedShift);

        return acc;
      }, {});

      setUserShiftsByDay(shiftsByDay);
      setLoading(false);
    }
  }, [schedule.shifts, user._id]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator animating={loading} size="large" />
      ) : (
        <ScrollView>
          <Text style={styles.headerText}>Your Shifts</Text>
          {Object.keys(userShiftsByDay).length === 0 ? (
            <Text style={styles.noShiftsText}>No shifts available for this user.</Text>
          ) : (
            Object.entries(userShiftsByDay).map(([date, shifts]) => (
              <DayComponent key={date} date={date} shifts={shifts} navigation={navigation} />
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default UsersShifts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  noShiftsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
