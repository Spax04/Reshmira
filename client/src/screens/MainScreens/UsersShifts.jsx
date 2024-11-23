import { StyleSheet, View, ScrollView, ActivityIndicator, Text, TouchableOpacity ,FlatList} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DayComponent from '../../components/GroupShiftsSchedule/DayComponent';
import moment from 'moment';
import LoadingComponent from '../../components/Utils/LoadingComponent';
import 'moment/locale/he';
import CButton from '../../components/common/CButton';
import { COMMON } from '../../constants';
import EmptyList from '../../components/Utils/EmptyList';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const UsersShifts = ({ navigation }) => {
  const schedule = useSelector((state) => state.schedule);
  const user = useSelector((state) => state.user);
  const [userShiftsByDay, setUserShiftsByDay] = useState({});
  const [loading, setLoading] = useState(true);
  const [isAllShiftsPressed,setIsAllShiftsPressed] = useState(false)
  const [isUsersShiftsPressed,setIsUsersShiftsPressed] = useState(false)
  const [isChangeView,setIsChangeView] = useState(false)



  const formateShifts = ( shifts)=>{
    const shiftsByDay = shifts.reduce((acc, shift) => {
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
  
  const handleAllShifts = ()=>{
    setIsAllShiftsPressed(true)
    setIsUsersShiftsPressed(false)
    formateShifts(schedule.shifts)
  }

  const handleUsersShifts = () =>{
    setIsAllShiftsPressed(false)
    setIsUsersShiftsPressed(true)
    const filteredShifts = schedule.shifts.filter((shift) =>
      shift.guard_posts.some((post) =>
        post.guards.some((guardId) => guardId._id.toString() === user._id.toString())
      )
    );
    formateShifts(filteredShifts)
  }

  const handleChangeSheduleView = () =>{
   setIsChangeView(!isChangeView)
  }

  useEffect(() => {
    if (schedule.shifts && user._id) {
      handleUsersShifts()
    }
     
  }, [schedule.shifts, user._id]);

  useEffect(() => {
    if (schedule.shifts.length === 0) {
      setLoading(true)
    } else {
      setLoading(false)
    }
  }, [schedule.shifts])
  return (
    <View style={styles.container}>
      {loading?  <LoadingComponent isLoading={loading} />
:   ( <FlatList
  style={styles.fletList}
  data={Object.entries(userShiftsByDay)}
  showsVerticalScrollIndicator={false}
    keyExtractor={(item, index) => index.toString()}
    ListHeaderComponent={
      <View style={{flex:1,flexDirection:'row', justifyContent:'flex-end'}}>
        <View>
        <CButton onPress={handleChangeSheduleView} type={COMMON.BTN_TYPES.INFO} icon={<MaterialCommunityIcons name="table-large" size={22} color="black" />} isPressed={isChangeView}/>

          </View>
        <View style={{flex:1,flexDirection:'row', justifyContent:'flex-end'}}>

          <CButton onPress={handleUsersShifts} content={"שמירות שלי"} isPressed={isUsersShiftsPressed}/>
          <CButton onPress={handleAllShifts} content={"כל השמירות"} isPressed={isAllShiftsPressed}/>
        </View>
     </View>
    }
    renderItem={({ item: [date, shifts] }) => (
      <DayComponent key={date} date={date} shifts={shifts} navigation={navigation} isTableView={isChangeView} />
    )}
    ListEmptyComponent={<EmptyList/>}
  />)
  }
     
     
    </View>
  );
};

export default UsersShifts;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    height:"100%"
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign:'right'
  },
  noShiftsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },fletList:{
    height:"auto"
  }
});
