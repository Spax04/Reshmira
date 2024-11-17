import { View, Text, Button, TouchableOpacity, Platform } from 'react-native'
import React, { useEffect } from 'react'
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from '@react-navigation/drawer'
import Feather from '@expo/vector-icons/Feather';

import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { COLORS, ROUTES, VARS } from '../constants'
import ButtomTabNavigator from './ButtomTabNavigator'
import Settings from '../screens/CommonScreens/Settings' // Ensure this is the correct path to your Settings screen
import RoomNavigator from './RoomNavigator'
import UserNavigator from "./UserNavigator"
import { useSelector } from 'react-redux'
import { removeUser } from '../store/reducers/userReducer'
import { useDispatch } from 'react-redux'
import { removeRoom } from '../store/reducers/roomReducer'
import { removeSchedule, setSchedule, setShiftsList } from '../store/reducers/scheduleReducer'
import api from "../utils/requstInterceptor";
import DeveloperSignature from '../components/Utils/DeveloperSignature'
import AdminSettings from '../screens/CommonScreens/AdminSettings'
import Icon from 'react-native-vector-icons/MaterialIcons' // Import the icon library
import { navigate } from '../utils/navigationService'

const Drawer = createDrawerNavigator()

const CustomDrawerContent = props => {
  const navigation = useNavigation()
  const dispatch = useDispatch()

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} onItemPress={() => navigation.closeDrawer()} />
      <DrawerItem
        label='להתנתק'
       
        onPress={() => {
          dispatch(removeUser())
          dispatch(removeRoom())
          dispatch(removeSchedule())
          navigation.navigate(ROUTES.LOGIN) // Navigate to UserProfile with user data
          console.log('Logout pressed')
          
        }}
icon={({ focused, color, size }) =><Feather name="log-out" size={24} color="black" />
}
      />
      <DeveloperSignature />
    </DrawerContentScrollView>
  )
}

const DrawerNavigator = () => {

  const navigation = useNavigation()
  useEffect(() => {
    const unsubscribe = navigation.addListener('drawerItemPress', (e) => {
      // Prevent default behavior
      e.preventDefault();
  
      // Do something manually
      // ...
    });
  
    return unsubscribe;
  }, [navigation]);
  const navigateToAdminSettigns = () => {
    console.log("TRYING REDIRECT");
    try {

      navigation.navigate(ROUTES.USER_STACK, { screen: ROUTES.ADMIN_SETTINGS });
    } catch (e) {
      console.log(e);
    }
  }
  const user = useSelector(state => state.user)
  const schedule = useSelector(state => state.schedule)
  const room = useSelector(state => state.room)
  const dispatch = useDispatch()
  useEffect(() => {
    

    getSchedule = async () => {

      if (room.scheduleId !== null && schedule._id === null) {
        console.log("inside!")
        try {

          const { data: scheduleResponse } = await api.get(`${VARS.API_URL}/schedule/${room.scheduleId}`)
          console.log(scheduleResponse)
          if (scheduleResponse.success) {
            console.log("SHEDULE RESPONSE:")
            console.log(scheduleResponse.data);

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
  }, [user.room_id])
  return (
    <Drawer.Navigator
    
    drawerContent={props => <CustomDrawerContent {...props} />}
    screenOptions={({ navigation }) => ({
      headerTitle: `טוב שחזרת, ${user.full_name}`,
      headerStyle: {
        backgroundColor: COLORS.mainYellowL, 
      },
      drawerPosition:'right',
      headerTintColor: '#000',
      drawerHideStatusBarOnOpen: true,
      drawerStatusBarAnimation: 'front',
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Feather
            name="menu"
            size={24}
            color="black"
            style={{ marginRight: 16 }} 
          />
        </TouchableOpacity>
      ),
      headerTitleAlign: 'center',
      headerLeft: false,
    })}
      

    >
      {room.scheduleId !== null ? (
        <Drawer.Screen
          name={ROUTES.HOME_DRAWER}
          component={ButtomTabNavigator}
          options={{
            title: 'דף הבית',
            headerLeft: () => (
              (room.scheduleId !== null && user._id === room.adminId) ?
                (<TouchableOpacity onPress={navigateToAdminSettigns}
                >

                  <Icon
                    name="admin-panel-settings"
                    size={30}
                    color="#000"
                    style={{ marginLeft: 15, marginRight: 10 }}
                  />
                </TouchableOpacity>) : <></>
            ),
            drawerIcon:  ({focused, size}) => (<Feather name="home" size={24} color="black" />)
          }}
        />
      ) : (
        <Drawer.Screen
          name={ROUTES.ROOM_STACK}
          component={RoomNavigator}
          options={{
            title: 'דף החדר',
            drawerIcon:  ({focused, size}) => (<Feather name="users" size={24} color="black" />)
            
          }}
        />
      )}
      <Drawer.Screen
        name={ROUTES.SETTINGS}
        component={Settings}
        options={{
          title: 'הגדרות',
          drawerIcon:  ({focused, size}) => (<Feather name="settings" size={24} color="black" />)
        }}
      />
     
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