import { View, Text, Button } from 'react-native'
import React, { useEffect } from 'react'
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from '@react-navigation/drawer'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { ROUTES } from '../constants'
import ButtomTabNavigator from './ButtomTabNavigator'
import Settings from '../screens/CommonScreens/Settings' // Ensure this is the correct path to your Settings screen
import RoomNavigator from './RoomNavigator'
import { useSelector } from 'react-redux'
import { removeUser } from '../store/reducers/userReducer'
import { useDispatch } from 'react-redux'
import { removeRoom } from '../store/reducers/roomReducer'
import { scheduleRemove } from '../store/reducers/scheduleReducer'

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
    </DrawerContentScrollView>
  )
}

const DrawerNavigator = () => {
  const user = useSelector(state => state.user)
  const schedule = useSelector(state => state.schedule)

  useEffect(() => {
    console.log('user in drawer ' + { ...user })
  }, [user.roomId])
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerTitle: ''
      }}
    >
      {user.roomId !== null && schedule._id !== "" ? (
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
    </Drawer.Navigator>
  )
}

export default DrawerNavigator
