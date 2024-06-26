import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ROUTES } from '../constants';
import { GroupShifts, UsersShifts } from '../screens';


const Tab = createBottomTabNavigator();


const ButtomTabNavigator = () => {
  return (
    <Tab.Navigator>
        <Tab.Screen
        name={ROUTES.USER_SHIFTS}
        component={UsersShifts}
      />
      <Tab.Screen
        name={ROUTES.GROUP_SHIFTS}
        component={GroupShifts}
      />
      
    </Tab.Navigator>
  )
}

export default ButtomTabNavigator