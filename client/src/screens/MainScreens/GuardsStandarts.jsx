import { StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DayComponent from '../../components/GroupShiftsSchedule/DayComponent';
import moment from 'moment';
import UnderConstruction from '../../components/Utils/UnderConstruction';

const GuardsStandarts = ({ navigation }) => {
 

  return (
    <View style={styles.container}>
      <UnderConstruction/>
    </View>
  );
};

export default GuardsStandarts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
