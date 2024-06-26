import { View, Text } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ROUTES } from '../constants';
import ButtomTabNavigator from './ButtomTabNavigator';

const Drawer = createDrawerNavigator();


const DrawerNavigator = () => {
  return (
    <Drawer.Navigator>
        <Drawer.Screen name={ROUTES.HOME_DRAWER} component={ButtomTabNavigator}/>
    </Drawer.Navigator>
  )
}

export default DrawerNavigator