import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  RefreshControl, ScrollView, TextInput, Platform, Modal, Button
} from "react-native";
import axios from "axios";
import { COLORS, ROUTES, VARS } from "../../constants";
import { removeRoom, setRoomUsers } from "../../store/reducers/roomReducer";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "react-native-toast-notifications";
import AntDesign from "@expo/vector-icons/AntDesign";
import DateTimePicker from '@react-native-community/datetimepicker';
import api from "../../utils/requstInterceptor";

const ManagerRoomScreen = ({ navigation }) => {
  const toast = useToast();
  const [roomCode, setRoomCode] = useState("");
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const room = useSelector((state) => state.room);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [scheduleName, setScheduleName] = useState("");
  const [shiftLength, setShiftLength] = useState("");

  const [position, setPosition] = useState([]);


  // States for new position input
  const [newPositionName, setNewPositionName] = useState("");
  const [newGuardPrePosition, setNewGuardPrePosition] = useState("");

  useEffect(() => {
    if (user._id === room.adminId && room.adminId !== "") {
      console.log("Correct admin");

      setUsers(room.users);
      setRoomCode(room.secret);
    } else {
      navigation.navigate(ROUTES.LOBBY_ROOM);
    }
  }, []);

  const toggleSettings = () => {
    setIsSettingsVisible(!isSettingsVisible);
  };

  const addPosition = () => {
    if (newPositionName && newGuardPrePosition) {
      const newPosition = {
        positionName: newPositionName,
        guardPrePosition: parseInt(newGuardPrePosition), // Convert to number
      };

      setPosition((prevPositions) => [...prevPositions, newPosition]);

      // Clear input fields after adding
      setNewPositionName("");
      setNewGuardPrePosition("");
    } else {
      toast.show("Please enter valid position details.", {
        type: "warning",
        placement: "bottom",
        duration: 4000,
        offset: 30,
        animationType: "slide-in",
      });
    }
  };
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
    } catch { }
  };

  const handleCreateSchedule = async () => {
    const { success: createCheduleSeccess, data: createScheduleData, msg: createScheduleMsg } = await api.post(VARS.API_URL,)
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
      const { data: removeUserResponse } = await api.post(`${VARS.API_URL}/room/out`, { secret: room.secret, participantId: userId },);

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

  const renderPositions = () => {
    return (
      <View style={styles.positionContainer}>
        <Text style={styles.sectionTitle}>Position List</Text>
        {position.map((pos, index) => (
          <View key={index} style={styles.positionItem}>
            <View style={styles.positionInfo}>
              <Text style={styles.positionName}>{pos.positionName}</Text>
              <Text style={styles.positionGuards}>
                {pos.guardPrePosition} {pos.guardPrePosition > 1 ? 'Guards' : 'Guard'}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const [time, setTime] = useState(new Date()); // Default to current time
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [showModal, setShowModal] = useState(false); // Controls the modal visibility

  // Handler for time picker
  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setTime(currentTime);
    if (Platform.OS === 'android') {
      setShowModal(false); // Close modal when time is picked on Android
    }
  };

  // Close the modal manually for iOS after time is picked
  const closeModal = () => {
    setShowModal(false);
  };
  const formatTime = (time) => {
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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


        {roomCode ? (
          <Text style={styles.roomCode}>Room Code: {roomCode}</Text>
        ) : null}
        <TouchableOpacity style={styles.button} onPress={handleCreateSchedule}>
          <Text style={styles.buttonText}>Create Schedule</Text>
        </TouchableOpacity>


        <ScrollView style={styles.settingsContainer}>
          <ScrollView style={styles.settingsContainer}>
            <Text style={styles.label}>Schedule Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter schedule name"
              value={scheduleName}
              onChangeText={setScheduleName}
            />

            <Text style={styles.label}>Select Shift Time:</Text>
            <TouchableOpacity
              style={styles.selectInput} // Different style for Touchable
              onPress={() => setShowModal(true)}
            >
              <Text style={styles.selectText}>{formatTime(time)}</Text>
            </TouchableOpacity>

            <Modal
              transparent={true}
              animationType="slide"
              visible={showModal}
              onRequestClose={() => setShowModal(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  {/* Time Picker */}
                  {Platform.OS === 'ios' && (
                    <View style={styles.pickerContainer}>
                      <DateTimePicker
                        value={time}
                        mode="time"
                        is24Hour={true}
                        display="spinner"
                        onChange={onTimeChange}
                      />
                    </View>
                  )}

                  {Platform.OS === 'android' && showTimePicker && (
                    <DateTimePicker
                      value={time}
                      mode="time"
                      is24Hour={true}
                      display="spinner"
                      onChange={onTimeChange}
                    />
                  )}

                  {/* Close Button for iOS */}
                  {Platform.OS === 'ios' && (
                    <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                      <Text style={styles.modalButtonText}>Done</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </Modal>

            <Text style={styles.sectionTitle}>Add New Position</Text>

            <Text style={styles.label}>Position Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter position name"
              value={newPositionName}
              onChangeText={setNewPositionName}
            />

            <Text style={styles.label}>Number of Guards:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter number of guards"
              keyboardType="numeric"
              value={newGuardPrePosition}
              onChangeText={setNewGuardPrePosition}
            />

            <TouchableOpacity style={styles.submitButton} onPress={addPosition}>
              <Text style={styles.submitButtonText}>Add Position</Text>
            </TouchableOpacity>
          </ScrollView>


          {roomCode ? (
            <>
              {renderPositions()}
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
        </ScrollView>
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
  pickerContainer: {
    marginBottom: 20,
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
  positionContainer: {
    padding: 10,
    marginBottom: 10,
  },
  positionItem: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: COLORS.lightGray,
  },
  positionText: {
    fontSize: 16,
    color: COLORS.darkGray,
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
  flatList: { width: "90%" }, toggleButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: "center",
  },
  toggleButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  toggleContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },


  settingsContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa", // Light background for better contrast
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333", // Darker color for label text
  },
  input: {
    backgroundColor: "#fff", // White background for input fields
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2, // Shadow for Android
  },
  selectInput: {
    backgroundColor: "#fff", // Same background as inputs
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2, // Shadow for Android
  },
  selectText: {
    fontSize: 16,
    color: "#444", // Subtle color for selected text
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dimmed background
  },
  modalContent: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalButton: {
    marginTop: 20,
    backgroundColor: "#f39c12", // Brighter color for the modal button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333", // Consistent title color
  },
  submitButton: {
    backgroundColor: "#27ae60", // Green button for submission
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
