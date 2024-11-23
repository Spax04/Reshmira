import { initializeUserState } from "../store/reducers/userReducer";
import { initializeRoomState } from "../store/reducers/roomReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeScheduleState } from "../store/reducers/scheduleReducer";
import * as SecureStore from 'expo-secure-store';

export const initializeAppState = () => async (dispatch) => {
  try {
    const userJson = await SecureStore.getItemAsync("user");
    const tokenJson = await SecureStore.getItemAsync("token");
    const roomJson = await AsyncStorage.getItem("room");

    const user = userJson ? JSON.parse(userJson) : {};
    console.log("USER INIT");
    console.log(user);
    const token = tokenJson ? JSON.parse(tokenJson) : "";
    const room = roomJson ? JSON.parse(roomJson) : {};
    console.log("ROOM INIT");
    console.log(room);

    dispatch(initializeUserState({ ...user, token }));
    dispatch(initializeRoomState(room));
  } catch (error) {
    console.error("Error initializing app state:", error);
    dispatch(initializeUserState({})); // initialize with empty state on error
    dispatch(initializeRoomState({}));

  }
};
