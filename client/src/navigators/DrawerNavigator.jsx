import { View, Text, Button } from 'react-native'
import React, { useEffect } from 'react'
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from '@react-navigation/drawer'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { ROUTES, VARS } from '../constants'
import ButtomTabNavigator from './ButtomTabNavigator'
import Settings from '../screens/CommonScreens/Settings' // Ensure this is the correct path to your Settings screen
import RoomNavigator from './RoomNavigator'
import { useSelector } from 'react-redux'
import { removeUser } from '../store/reducers/userReducer'
import { useDispatch } from 'react-redux'
import { removeRoom } from '../store/reducers/roomReducer'
import { scheduleRemove, setSchedule, setShiftsList } from '../store/reducers/scheduleReducer'
import api from "../utils/requstInterceptor";
import DeveloperSignature from '../components/Utils/DeveloperSignature'
import AdminSettings from '../screens/CommonScreens/AdminSettings'

const Drawer = createDrawerNavigator()

const CustomDrawerContent = props => {
  const navigation = useNavigation()
  const dispatch = useDispatch()

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label='Logout'
        onPress={() => {
          dispatch(removeUser())
          dispatch(removeRoom())
          dispatch(scheduleRemove())
          navigation.navigate(ROUTES.LOGIN) // Navigate to UserProfile with user data
          console.log('Logout pressed')
        }}
      />
      <DeveloperSignature />
    </DrawerContentScrollView>
  )
}

const DrawerNavigator = () => {
  const user = useSelector(state => state.user)
  const schedule = useSelector(state => state.schedule)
  const room = useSelector(state => state.room)
  const dispatch = useDispatch()
  useEffect(() => {
    console.log("shedule id in room: " + room.scheduleId);
    console.log("shedule id: " + schedule._id);
    console.log("room id in user: " + user.roomId)

    getSchedule = async () => {
      
      if (room.scheduleId !== null && schedule._id === null) {
        console.log("inside!")
        try {

          const { data: scheduleResponse } = await api.get(`${VARS.API_URL}/schedule/${room.scheduleId}`)
          console.log(scheduleResponse)
          if (scheduleResponse.success) {
            console.log("SHEDULE RESPONSE:" + scheduleResponse.data)

            const { data: shiftResponse } = await api.post(`${VARS.API_URL}/shift/get-list/`, { shiftsIds: scheduleResponse.data.shifts })
            scheduleResponse.data.shifts = []
            dispatch(setSchedule(scheduleResponse.data))
            console.log(shiftResponse.data);
            dispatch(setShiftsList(shiftResponse.data))
          }
        } catch (err) {
          console.error(err)
        }
      }
    }
    getSchedule()
  }, [room.scheduleId])
  useEffect(() => {
    console.log('user in drawer ' + { ...user })
  }, [user.roomId])
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerTitle: `Welcome, ${user.fullName}`
      }}
      >
      {room.scheduleId !== null ? (
        <Drawer.Screen
          name={ROUTES.HOME_DRAWER}
          component={ButtomTabNavigator}
          options={{
            title: 'Main'
          }}
        />
      ) : (
        <Drawer.Screen
          name={ROUTES.ROOM_STACK}
          component={RoomNavigator}
          options={{
            title: 'Room menu'
          }}
          />
      )}
      <Drawer.Screen
        name={ROUTES.SETTINGS}
        component={Settings}
        options={{
          title: 'Settings'
        }}
      />
      {(room.scheduleId !== null && user._id === room.adminId) ?
      <Drawer.Screen
      name={ROUTES.ADMIN_SETTINGS}
      component={AdminSettings}
      options={{
        title: 'Admin Settings'
      }}
    />:<></>}
    </Drawer.Navigator>
  )
}

export default DrawerNavigator

const styles = {
  versionContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    color: '#777', // Light gray for subtle display
  },
};