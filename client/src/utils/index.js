import { initializeUserState } from "../store/reducers/userReducer";
import { initializeRoomState } from "../store/reducers/roomReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeScheduleState } from "../store/reducers/scheduleReducer";

export const initializeAppState = () => async (dispatch) => {
  try {
    const userJson = await AsyncStorage.getItem("user");
    const tokenJson = await AsyncStorage.getItem("token");
    const roomJson = await AsyncStorage.getItem("room");

    const user = userJson ? JSON.parse(userJson) : {};
    console.log("USER INIT");
    console.log(user);
    const token = tokenJson ? JSON.parse(tokenJson) : "";
    const room = roomJson ? JSON.parse(roomJson) : {};

    dispatch(initializeUserState({ ...user, token }));
    dispatch(initializeRoomState(room));
  } catch (error) {
    console.error("Error initializing app state:", error);
    dispatch(initializeUserState({})); // initialize with empty state on error
    dispatch(initializeRoomState({}));

  }
};
