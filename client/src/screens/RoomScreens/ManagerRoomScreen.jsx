import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  RefreshControl,
} from "react-native";
import axios from "axios";
import { COLORS, ROUTES, VARS } from "../../constants";
import { removeRoom, setRoomUsers } from "../../store/reducers/roomReducer";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "react-native-toast-notifications";
import AntDesign from "@expo/vector-icons/AntDesign";

const ManagerRoomScreen = ({ navigation }) => {
  const toast = useToast();
  const [roomCode, setRoomCode] = useState("");
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const room = useSelector((state) => state.room);
  const user = useSelector((state) => state.user);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (user._id === room.adminId && room.adminId !== "") {
      console.log("Correct admin");

      setUsers(room.users);
      setRoomCode(room.secret);
    } else {
      navigation.navigate(ROUTES.LOBBY_ROOM);
    }
  }, []);

  const handleDeleteRoom = async () => {
    dispatch(removeRoom());
    navigation.navigate(ROUTES.LOBBY_ROOM);

    try {
      const { data: roomDeleteResponse } = await axios.post(
        `${VARS.API_URL}/room/delete`,
        { roomId: room._id },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(roomDeleteResponse);

      if (!roomDeleteResponse.success) {
        toast.show("Error on deleting room.", {
          type: "warning",
          placement: "bottom",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });
      } else {
        toast.show("Room was deleted successfully!", {
          type: "success",
          placement: "bottom",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });
        navigation.navigate(ROUTES.LOBBY_ROOM);
      }
    } catch {}
  };

  const handleCreateSchedule = () => {
    // navigation.navigate('CreateScheduleScreen') // Navigate to the schedule creation screen
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const { data: usersByRoomIdResponse } = await axios.get(
        `${VARS.API_URL}/room/${room._id}/users`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (usersByRoomIdResponse.success) {
        setUsers(usersByRoomIdResponse.data);
        dispatch(setRoomUsers(usersByRoomIdResponse.data));
      } else {
        setMsg("Failed to refresh users.");
        toast.show("Failed to refresh users.", {
          type: "danger",
          placement: "bottom",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });
      }
    } catch (error) {
      console.error("Error refreshing users:", error);
      toast.show("Error refreshing users: " + error, {
        type: "danger",
        placement: "bottom",
        duration: 4000,
        offset: 30,
        animationType: "slide-in",
      });
    }
    setRefreshing(false);
  };
  const handleRemoveUser = async (userId) => {
    try {
      const { data: removeUserResponse } = await axios.post(
        `${VARS.API_URL}/room/out`,
        { secret: room.secret, participantId: userId },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (removeUserResponse.success) {
        // Filter out the removed user from local state
        const updatedUsers = users.filter((user) => user._id !== userId);
        setUsers(updatedUsers);
        dispatch(setRoomUsers(updatedUsers)); // Update Redux state
        toast.show("User removed successfully.", {
          type: "success",
          placement: "bottom",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });
      } else {
        toast.show(removeUserResponse.msg, {
          type: "danger",
          placement: "bottom",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });
      }
    } catch (error) {
      console.error("Error removing user:", error);
      toast.show("Error occurred while removing user.", {
        type: "danger",
        placement: "bottom",
        duration: 4000,
        offset: 30,
        animationType: "slide-in",
      });
    }
  };

  useEffect(() => {
    const updateUserList = async () => {
      await onRefresh();
    };
    updateUserList();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text> // Display error message if it exists
        ) : null}

        {roomCode ? (
          <Text style={styles.roomCode}>Room Code: {roomCode}</Text>
        ) : null}
        <TouchableOpacity style={styles.button} onPress={handleCreateSchedule}>
          <Text style={styles.buttonText}>Create Schedule</Text>
        </TouchableOpacity>
        {roomCode ? (
          <>
            <Text style={styles.usersHeader}>
              Connected Users ({users.length}) :
            </Text>
            <FlatList
              style={styles.flatList}
              data={users}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.userItem}>
                  <View style={styles.userInfoContainer}>
                    <Text style={styles.userName}>{item.fullName}</Text>
                    {item._id !== user._id && ( // Show remove button if it's not the admin
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => handleRemoveUser(item._id)}
                      >
                        <AntDesign
                          name="closesquare"
                          size={24}
                          color={COLORS.mainRed}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
              ListEmptyComponent={<Text>No Users Connected</Text>}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          </>
        ) : null}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteRoom}
        >
          <Text style={styles.deleteButtonText}>Delete Room</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ManagerRoomScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    marginLeft: 40,
    marginRight: 40,
  },
  roomCode: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#555",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.mainYellowL,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 20,
  },
  deleteButton: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.mainRed,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 20,
  },
  deleteButtonText: {
    color: COLORS.whiteText,
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonText: {
    color: COLORS.mainDark,
    fontSize: 18,
    fontWeight: "bold",
  },
  usersHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#444",
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
  userInfoContainer: {
    display: "flex",
    flexDirection: "row", // Arrange children in a row
    alignItems: "center", // Center items vertically
    justifyContent: "space-between", // Distribute space evenly
  },
  flatList: { width: "90%" },
});
