import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import UserComponent from './UserComponent';
import { ROUTES } from '../../constants';

const ShiftComponent = ({ date, startTime, endTime, positions, navigation }) => {
  const handleUserPress = (user) => {
    navigation.navigate(ROUTES.USER_STACK, {
      screen: ROUTES.USER_PROFILE,
      params: { user }
    });
  };

  useEffect(()=>{console.log("POSITIONS"+{positions});},[])

  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>{date}</Text>
      <Text style={styles.timeText}>
        {startTime} - {endTime}
      </Text>
      {positions?.map((post, index) => (
        <View key={index} style={styles.positionContainer}>
          <Text style={styles.positionText}>
            {post.position_name} 
          </Text>
          <View style={styles.userContainer}>
            {post.guards?.map((guard, userIndex) => (
              <UserComponent
                key={userIndex}
                user={guard}
                onPress={() => handleUserPress(guard._id)}
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};

export default ShiftComponent;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2
  },
  dateText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#555'
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  positionText: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: 'bold',
    color: '#333'
  },
  positionContainer: {
    marginVertical: 5,
  },
  userContainer: {
    flexDirection: 'row',
    marginTop: 4,
    flexWrap: 'wrap'
  }
});
