import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import UnderConstruction from '../../components/Utils/UnderConstruction';

const Settings = () => {
  return (
    <View style={styles.container}>
      <UnderConstruction />
    </View>
  )
}

export default Settings

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Slightly off-white background for better contrast
    padding: 16,
    justifyContent: 'center',
  },
})