import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { ROUTES } from '../constants'
import { GuardsStandarts, UsersShifts, CalendarShifts } from '../screens'
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
            icon = focused ? 'clipboard-list' : 'clipboard-list-outline'
          } else if (route.name === ROUTES.USER_SHIFTS) {
            icon = focused ? 'clipboard-text-clock' : 'clipboard-text-clock-outline'
          }
          return <MaterialCommunityIcons name={icon} size={24} color={color} />
        }
      })}
    >
      <Tab.Screen 
        options={
          {
            title:'לו"ז',
            tabBarShowLabel:true,
            tabBarLabelStyle: styles.tabBarLabelStyle
          }
        }
        name={ROUTES.CALENDAR_SHIFTS} component={CalendarShifts} />
      <Tab.Screen
       options={
          {
            title:'שמירות',
            tabBarShowLabel:true,
            tabBarLabelStyle: styles.tabBarLabelStyle
          }
        } 
        name={ROUTES.USER_SHIFTS} component={UsersShifts} />
      <Tab.Screen options={
          {
            title:'תקנים',
            tabBarShowLabel:true,
            tabBarLabelStyle: styles.tabBarLabelStyle
          }
        }  
        name={ROUTES.GROUP_SHIFTS} component={GuardsStandarts} />
    </Tab.Navigator>
  )
}

export default ButtomTabNavigator

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 80, // Adjust height here
    paddingBottom: 10 // Optional: add padding
  },
  tabBarItemStyle: {},
  tabBarLabelStyle:{
    fontSize: 12,
    fontWeight: 300,
  }
})
