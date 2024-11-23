import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  RefreshControl, TextInput, Platform, Modal
} from "react-native";
import axios from "axios";
import { COLORS, ROUTES, VARS } from "../../constants";
import { removeRoom, setRoomUsers } from "../../store/reducers/roomReducer";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "react-native-toast-notifications";
import AntDesign from "@expo/vector-icons/AntDesign";
import DateTimePicker from '@react-native-community/datetimepicker';
import api from "../../utils/requstInterceptor";
import { setScheduleId } from "../../store/reducers/roomReducer";
import {
  useSharedValue,
} from 'react-native-reanimated';
import AccordionItem from "../../components/common/AccordionItem";
import LoadingComponent from "../../components/Utils/LoadingComponent";
import * as Clipboard from 'expo-clipboard';
import Feather from '@expo/vector-icons/Feather';


const ManagerRoomScreen = ({ navigation }) => {
  const toast = useToast();
  const [roomCode, setRoomCode] = useState("");
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const room = useSelector((state) => state.room);
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false)
  const [isScheduleAccordionOpen, setIsScheduleAccordionOpen] = useState(false);
  const [isPositionsAccordionOpen, setIsPositionsAccordionOpen] = useState(false);

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
  const scheduleSettingsOpen = useSharedValue(false);
  const positionsSettingsOpen = useSharedValue(false);


  const [scheduleName, setScheduleName] = useState("");

  const [positionList, setPositionList] = useState([]);
  const [shiftTime, setShiftTime] = useState(new Date(new Date().setHours(0, 0, 0, 0)));

  const [scheduleDate, setScheduleDate] = useState(Date.now());
  const [scheduleTimeStart, setScheduleTimeStart] = useState(new Date(new Date().setHours(0, 0, 0, 0))) // Only for android

  const [showShiftTimeModal, setShowShiftTimeModal] = useState(false);
  const [showScheduleStartDateModal, setShowScheduleStartDateModal] = useState(false)
  const [showScheduleStartTimeModal, setShowScheduleStartTimeModal] = useState(false) // Only for android


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



  const addPosition = () => {
    if (newPositionName && newGuardPrePosition) {
      const newPosition = {
        position_name: newPositionName,
        guards_pre_position: parseInt(newGuardPrePosition),
      };

      setPositionList((prevPositions) => [...prevPositions, newPosition]);
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
      const { data: roomDeleteResponse } = await api.delete(`${VARS.API_URL}/room/delete/${room._id}`);

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
    const totalGuardsPreShift = positionList.reduce((total, pos) => total + pos.guards_pre_position, 0);

    const formattedShiftTime = shiftTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    let formatedScheduleDate

    if (Platform.OS === 'android') {
      scheduleDate.setHours(scheduleTimeStart.getHours());
      scheduleDate.setMinutes(scheduleTimeStart.getMinutes());

      formatedScheduleDate = scheduleDate.getTime() / 1000;
    } else {
      formatedScheduleDate = scheduleDate.getTime() / 1000
    }

    if (scheduleName === '') {
      toast.show("Set schedule name!", {
        type: "warning",
        placement: "bottom",
        duration: 4000,
        offset: 30,
        animationType: "slide-in",
      });
      return;
    }

    if (!users.length >= 1) {
      toast.show("Must be more then one user connected!", {
        type: "warning",
        placement: "bottom",
        duration: 4000,
        offset: 30,
        animationType: "slide-in",
      });
      return;
    }

    if (shiftTime.getHours() === 0 && shiftTime.getMinutes() === 0) {
      toast.show("Shift time not set", {
        type: "warning",
        placement: "bottom",
        duration: 4000,
        offset: 30,
        animationType: "slide-in",
      });
      return;
    }
    if (positionList.length === 0) {
      toast.show("At least one position needed!", {
        type: "warning",
        placement: "bottom",
        duration: 4000,
        offset: 30,
        animationType: "slide-in",
      });
      return;
    }


    setLoading(true)
    const newSchedule = {
      scheduleName: scheduleName,
      positions: positionList,
      guards: users,
      shiftTime: formattedShiftTime,
      guardsPreShift: totalGuardsPreShift,
      roomId: room._id,
      scheduleStartDate: formatedScheduleDate
    }

    try {

      const { data: scheduleResponse } = await api.post(`${VARS.API_URL}/schedule/create/`, newSchedule)

      if (scheduleResponse.success) {
        toast.show("Schedule was created successfully! Retreaing shifts...", {
          type: "success",
          placement: "bottom",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });

        dispatch(setScheduleId(scheduleResponse.data._id))

        navigation.navigate(ROUTES.HOME);
      } else {
        toast.show(scheduleResponse.msg, {
          type: "danger",
          placement: "bottom",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });
      }
    } catch (err) {
      console.log(err.message);
      toast.show(err.message, {
        type: "danger",
        placement: "bottom",
        duration: 4000,
        offset: 30,
        animationType: "slide-in",
      });
    } finally {
      setLoading(false)
    }
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
        const updatedUsers = users.filter((user) => user._id !== userId);
        setUsers(updatedUsers);
        dispatch(setRoomUsers(updatedUsers));
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
        {positionList.map((pos, index) => (
          <View key={index} style={styles.positionItem}>
            <View style={styles.positionInfo}>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => deletePosition(index)}
              >
                <AntDesign name="closesquare" size={24} color={COLORS.mainRed} />
              </TouchableOpacity>

              <View style={styles.positionDetails}>
                <Text style={styles.positionName}>{pos.position_name}</Text>
                <Text style={styles.positionGuards}>
                  {pos.guards_pre_position} {pos.guards_pre_position > 1 ? 'Guards' : 'Guard'}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };




  const onShiftTimeChange = (selectedTime) => {
    const time = selectedTime.nativeEvent.timestamp;

    setShiftTime(new Date(time));
    if (Platform.OS === 'android') {
      setShowShiftTimeModal(false);
    }
  };

  const onScheduleDateChange = (date) => {
    setScheduleDate(new Date(date.nativeEvent.timestamp));
    if (Platform.OS === 'android') {
      setShowScheduleStartDateModal(false);
    }
  };

  const onScheduleStartTimeChange = (selectedTime) => {
    setScheduleTimeStart(new Date(selectedTime.nativeEvent.timestamp));
    if (Platform.OS === 'android') {
      setShowScheduleStartTimeModal(false);
    }
  };

  const closeShiftTimeModal = () => {
    setShowShiftTimeModal(false);
  };

  const closeScheduleDateModal = () => {
    setShowScheduleStartDateModal(false);
  };
  const formatTime = (time) => {
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formateDate = (time) => {
    const date = new Date(time);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const deletePosition = (index) => {
    setPositionList((prevPositions) => {
      return prevPositions.filter((_, i) => i !== index);
    });
  };

  useEffect(() => {
    const updateUserList = async () => {
      await onRefresh();
    };
    updateUserList();
  }, []);


  const onScheduleSettingsOpen = () => {
    setIsScheduleAccordionOpen(!isScheduleAccordionOpen);
    scheduleSettingsOpen.value = !scheduleSettingsOpen.value
    console.log(scheduleSettingsOpen);
  }
  const onPositionSettingsOpen = () => {
    setIsPositionsAccordionOpen(!isPositionsAccordionOpen)
    positionsSettingsOpen.value = !positionsSettingsOpen.value
  }

  return (
    <View style={styles.container}>
      <LoadingComponent isLoading={loading} />
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
        <TouchableOpacity style={styles.createScheduleButton} onPress={handleCreateSchedule}>
          <Text style={styles.buttonText}>Create Schedule</Text>
        </TouchableOpacity>

        <FlatList
          style={styles.flatList}
          data={users}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={

            <View >
              <TouchableOpacity style={[
                styles.accordionScheduleButton,
                isScheduleAccordionOpen && { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
              ]} onPress={() => onScheduleSettingsOpen()}>
                <View style={styles.accordionButtonContainer}>
                <Text style={styles.deleteButtonText}>Schedule settings</Text>
                {isScheduleAccordionOpen? <AntDesign name="up" size={24} color={COLORS.whiteText} /> : <AntDesign name="down" size={24} color={COLORS.whiteText} />}

                </View>
              </TouchableOpacity>
              <AccordionItem isExpanded={scheduleSettingsOpen} viewKey="AccordionSchedule">

                <View style={styles.settingsContainer}>
                  <Text style={styles.label}>Schedule Name:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter schedule name"
                    value={scheduleName}
                    onChangeText={setScheduleName}
                  />

                  <Text style={styles.label}>Select Shift Time:</Text>
                  <TouchableOpacity
                    style={styles.selectInput}
                    onPress={() => setShowShiftTimeModal(true)}
                  >
                    <Text style={styles.selectText}>{formatTime(shiftTime)}</Text>
                  </TouchableOpacity>

                  <Modal
                    transparent={true}
                    animationType="slide"
                    visible={showShiftTimeModal}
                    onRequestClose={() => setShowShiftTimeModal(false)}
                  >
                    <View style={styles.modalContainer}>
                      {Platform.OS === 'ios' && (
                        <View style={styles.modalContent}>
                          <View style={styles.pickerContainer}>
                            <DateTimePicker
                              value={shiftTime}
                              mode="time"
                              is24Hour={true}
                              display="spinner"
                              onChange={onShiftTimeChange}
                              minuteInterval={15}
                            />

                          </View>
                            <TouchableOpacity
                              style={styles.modalButton}
                              onPress={closeShiftTimeModal}
                            >
                              <Text style={styles.modalButtonText}>Done</Text>
                            </TouchableOpacity>
                        </View>
                      )}
                      {Platform.OS === 'android' && (
                        <View style={styles.pickerContainer}>
                          <DateTimePicker
                            value={shiftTime}
                            mode="time"
                            is24Hour={true}
                            display="spinner"
                            onChange={onShiftTimeChange}
                            minuteInterval={15}
                          />
                        </View>
                      )}


                    </View>
                  </Modal>

                  <Text style={styles.label}>Select Schedule start date:</Text>
                  <TouchableOpacity
                    style={styles.selectInput}
                    onPress={() => setShowScheduleStartDateModal(true)}
                  >
                    <Text style={styles.selectText}>{formateDate(scheduleDate)}</Text>
                  </TouchableOpacity>

                  <Modal
                    transparent={true}
                    animationType="slide"
                    visible={showScheduleStartDateModal}
                    onRequestClose={() => setShowScheduleStartDateModal(false)}
                  >
                    <View style={styles.modalContainer}>
                      {Platform.OS === 'ios' && (
                        <View style={styles.modalContent}>
                          <View style={styles.pickerContainer}>
                            <DateTimePicker
                              value={new Date(scheduleDate)}
                              mode="datetime"
                              is24Hour={true}
                              display="spinner"
                              onChange={onScheduleDateChange}
                              minuteInterval={15}
                            />
                          </View>
                          <TouchableOpacity
                            style={styles.modalButton}
                            onPress={closeScheduleDateModal}
                          >
                            <Text style={styles.modalButtonText}>Done</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                      {Platform.OS === 'android' && (

                        <DateTimePicker
                          value={new Date(scheduleDate)}
                          mode="date"
                          is24Hour={true}
                          display="default"
                          onChange={onScheduleDateChange}
                        />
                      )}


                    </View>
                  </Modal>

                  {Platform.OS === 'android' ?
                    <View>
                      <Text style={styles.label}>Select Schedule start time:</Text>
                      <TouchableOpacity
                        style={styles.selectInput}
                        onPress={() => setShowScheduleStartTimeModal(true)}
                      >
                        <Text style={styles.selectText}>{formatTime(scheduleTimeStart)}</Text>
                      </TouchableOpacity>

                      <Modal
                        transparent={true}
                        animationType="slide"
                        visible={showScheduleStartTimeModal}
                        onRequestClose={() => setShowScheduleStartTimeModal(false)}
                      >
                        <View style={styles.modalContainer}>

                          {Platform.OS === 'android' && (

                            <DateTimePicker
                              value={scheduleTimeStart}
                              mode="time"
                              is24Hour={true}
                              display="spinner"
                              onChange={onScheduleStartTimeChange}
                              minuteInterval={15}

                            />
                          )}

                        </View>
                      </Modal>
                    </View> : <></>}
                </View>
              </AccordionItem>
              <View>

                <TouchableOpacity style={[styles.accordionScheduleButton, isPositionsAccordionOpen && { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]} onPress={onPositionSettingsOpen}>
                 <View style={styles.accordionButtonContainer}>
                  <Text style={styles.deleteButtonText}>Positions settings</Text>
                  {isPositionsAccordionOpen? <AntDesign name="up" size={24} color={COLORS.whiteText} /> : <AntDesign name="down" size={24} color={COLORS.whiteText} />}

                 </View>
                </TouchableOpacity>
                <AccordionItem isExpanded={positionsSettingsOpen} viewKey="AccordionPositions">
                  <View style={styles.settingsContainer}>


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


                    {renderPositions()}
                  </View>
                </AccordionItem>
                <Text style={styles.roomCodeHeader}>
                  Connected Users ({users.length}) :
                </Text>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.userItem}>
              <View style={styles.userInfoContainer}>
                <Text style={styles.userName}>{item.fullName}</Text>
                {item._id !== user._id && (
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
          ListFooterComponent={
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteRoom}
            >
              <Text style={styles.deleteButtonText}>Delete Room</Text>
            </TouchableOpacity>
          }
        />
      </View>
    </View >

  );
};

export default ManagerRoomScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15,
    marginRight: 15,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  createScheduleButton: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.mainYellowL,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 20,
  },
  accordionScheduleButton: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.mainBlue,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 20,
  },

  deleteButton: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.mainRed,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 20,
    marginTop: 20
  },

  positionContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  positionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  positionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeButton: {
    marginRight: 10,
  },
  positionDetails: {
    flexDirection: 'column',
  },
  positionName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  positionGuards: {
    fontSize: 14,
    color: '#666',
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
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
  },
  flatList: {
    width: "100%"
  },
  settingsContainer: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius:10,
    width: "100%",
    padding: 15
    // Light background for better contrast
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
    justifyContent:'center',
    alignItems:'center'
  },
  modalButton: {
    width:100,
    marginTop: 20,
    backgroundColor: COLORS.mainOrange,
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
    backgroundColor: COLORS.greenSubmit, // Green button for submission
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
  codeContainer: {
    flexDirection: "column",
    width: "100%",
    marginVertical: 32
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
    marginBottom: 5,
    marginTop: 15
  },
  accordionButtonContainer:{
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-around',
    width:"100%"
  }
});
