import { View, Text, Button } from 'react-native';
import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from '@react-navigation/drawer';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { ROUTES } from '../constants';
import ButtomTabNavigator from './ButtomTabNavigator';
import Settings from '../screens/Common/Settings'; // Ensure this is the correct path to your Settings screen

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const navigation = useNavigation();

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label='Logout'
        onPress={() => {
          navigation.navigate(ROUTES.LOGIN); // Navigate to UserProfile with user data
          console.log('Logout pressed');
        }}
      />
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerTitle: '' // Hide the title in the header
      }}
    >
      <Drawer.Screen
        name={ROUTES.HOME_DRAWER}
        component={ButtomTabNavigator}
        options={{
          title: 'Main' // Hide the drawer screen name
        }}
      />
      <Drawer.Screen
        name={ROUTES.SETTINGS}
        component={Settings}
        options={{
          title: 'Settings' // Hide the drawer screen name
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
