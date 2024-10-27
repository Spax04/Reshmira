import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

const UsersShifts = () => {
  
  const schedule = useSelector(state => state.schedule)
  useEffect(() => {
    console.log(schedule.shifts);
  })
  return (
    <View>
      <Text>UsersShifts</Text>
    </View>
  )
}

export default UsersShifts

const styles = StyleSheet.create({})