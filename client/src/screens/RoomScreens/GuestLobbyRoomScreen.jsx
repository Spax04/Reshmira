import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  RefreshControl,
} from "react-native";
import * as Clipboard from 'expo-clipboard';

import axios from "axios";
import { COLORS, ROUTES, VARS } from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import { removeRoom, setRoomUsers } from "../../store/reducers/roomReducer";
import { useToast } from "react-native-toast-notifications";
import { removeUsersRoomId, setScheduleId } from "../../store/reducers/userReducer";
import api from "../../utils/requstInterceptor";
import Feather from '@expo/vector-icons/Feather';

const GuestLobbyRoomScreen = ({ navigation }) => {
  const toast = useToast();

  const [roomCode, setRoomCode] = useState("");
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const room = useSelector((state) => state.room);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(roomCode);
    toast.show("Room code was copied!", {
      type: "normal",
      placement: "bottom",
      duration: 4000,
      offset: 30,
      animationType: "slide-in",
    });
  };

  useEffect(() => {
    if (room._id) {
      setRoomCode(room.secret);
      const updateUserList = async () => {
        await onRefresh();
      };
      updateUserList();
    } else {
      navigation.navigate(ROUTES.LOBBY_ROOM);
    }
  }, []);

  const handleLeaveRoom = async () => {
    try {
      const { data: leaveRoomResponse } = await axios.post(
        `${VARS.API_URL}/room/leave`,
        { roomId: room._id },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (leaveRoomResponse.success) {
        dispatch(removeRoom());
        navigation.navigate(ROUTES.LOBBY_ROOM);
      } else {
        toast.show(leaveRoomResponse.msg, {
          type: "danger",
          placement: "bottom",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });
      }
    } catch (error) {
      toast.show("Error leaving the room.", {
        type: "danger",
        placement: "bottom",
        duration: 4000,
        offset: 30,
        animationType: "slide-in",
      });
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const { data: usersByRoomIdResponse } = await api.get(
        `${VARS.API_URL}/room/${room._id}/users`,
      );
      if (usersByRoomIdResponse.success) {
        const { data: roomResponse } = await api.get(`${VARS.API_URL}/room/${room._id}`)
        if (roomResponse.success) {
          if (roomResponse.data.schedule_id) {
            console.log("Schedule id: " + roomResponse.data.schedule_id);
            dispatch(setScheduleId(roomResponse.data.schedule_id))
            navigation.navigate(ROUTES.HOME);
          }
        }
        setUsers(usersByRoomIdResponse.data);
        dispatch(setRoomUsers(usersByRoomIdResponse.data));
      } else {
        if (usersByRoomIdResponse.data === null) {
          toast.show("Room has been delted by Admin", {
            type: "warning",
            placement: "bottom",
            duration: 4000,
            offset: 30,
            animationType: "slide-in",
          });

          dispatch(removeUsersRoomId());
          dispatch(removeRoom());
          navigation.navigate(ROUTES.LOBBY_ROOM);
        }
        toast.show("Error on refresh users", {
          type: "danger",
          placement: "bottom",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });
      }
    } catch (error) {
      console.error("Error refreshing users:", error);
      toast.show("Error occurred while refreshing users.", {
        type: "danger",
        placement: "bottom",
        duration: 4000,
        offset: 30,
        animationType: "slide-in",
      });
    }
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {roomCode ? (
          <View style={styles.codeContainer}>

            <Text style={styles.roomCodeHeader}>Room Code </Text>
            <View style={styles.codeInnerContainer}>
              <Text style={styles.roomCode}>{roomCode}</Text>
              <TouchableOpacity onPress={() => copyToClipboard()}>
                <Feather name="copy" size={35} color="black" />
              </TouchableOpacity>
            </View>

          </View>
        ) : null}

        {roomCode ? (
          <View style={styles.codeContainer}>


            <Text style={styles.roomCodeHeader}>
              Participants ({users.length}) :
            </Text>
            <FlatList
              style={styles.flatList}
              data={users}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.userItem}>
                  <Text style={styles.userName}>{item.fullName}</Text>
                </View>
              )}
              ListEmptyComponent={<Text>No Participants Connected</Text>}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          </View>
        ) : null}

        <TouchableOpacity style={styles.leaveButton} onPress={handleLeaveRoom}>
          <Text style={styles.leaveButtonText}>Leave Room</Text>
        </TouchableOpacity>
      </View>
    </View >
  );
};

export default GuestLobbyRoomScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f0f0",
    width: "100%",
  },
  content: {
    flex: 1,
    alignItems: "center",
    marginTop: 50,
    marginLeft: 40,
    marginRight: 40,

  },
  roomCode: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#555",
    marginRight: 10,
  },
  roomCodeHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#555",
    marginRight: 10,
    marginBottom:5
  },

  leaveButton: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.mainRed,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 20,
  },
  leaveButtonText: {
    color: COLORS.whiteText,
    fontSize: 18,
    fontWeight: "bold",
  },
  usersHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#444",
    textAlign: 'left'
  },
  userItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  userName: {
    fontSize: 18,
    color: "#555",
  },
  messageContainer: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 10,
    borderRadius: 5,
  },
  messageText: {
    color: "#FFF",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 20,
  },
  flatList: {
    width: "100%"
  },
  codeContainer: {
    flexDirection: "column",
    width: "100%",
    marginVertical:32
  },
  codeInnerContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    justifyContent: 'space-between'
  }
});
