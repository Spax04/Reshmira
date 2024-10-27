import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { ROUTES } from '../constants'
import { GroupShifts, UsersShifts, CalendarShifts } from '../screens'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const Tab = createBottomTabNavigator()

const ButtomTabNavigator = () => {
  return (
    <Tab.Navigator
    initialRouteName={ROUTES.USER_SHIFTS}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBarStyle,
        tabBarIcon: ({ color, size, focused }) => {
          let icon

          if (route.name === ROUTES.CALENDAR_SHIFTS) {
            icon = focused ? 'calendar-month' : 'calendar-month-outline'
          } else if (route.name === ROUTES.GROUP_SHIFTS) {
            icon = focused ? 'calendar-clock' : 'calendar-clock-outline'
          } else if (route.name === ROUTES.USER_SHIFTS) {
            icon = focused ? 'calendar-account' : 'calendar-account-outline'
          }

          return <MaterialCommunityIcons name={icon} size={38} color={color} />
        }
      })}
    >
      <Tab.Screen name={ROUTES.CALENDAR_SHIFTS} component={CalendarShifts} />
      <Tab.Screen name={ROUTES.USER_SHIFTS} component={UsersShifts} />
      <Tab.Screen name={ROUTES.GROUP_SHIFTS} component={GroupShifts} />
    </Tab.Navigator>
  )
}

export default ButtomTabNavigator

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 80, // Adjust height here
    paddingBottom: 10 // Optional: add padding
  },
  tabBarItemStyle: {}
})
