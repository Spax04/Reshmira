import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";
import * as SecureStore from 'expo-secure-store';

const initialState = {
  token: "",
  _id: "",
  full_name: "",
  role: "none",
  room_id: null,
  shifts: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser:  (state, action) => {
      console.log("IN SET USER REDUCE!!!");
      console.log(action.payload);
      state._id = action.payload._id;
      state.full_name = action.payload.full_name;
      state.role = action.payload.role;
      state.room_id = action.payload.room_id;
      state.shifts = [...action.payload.shifts];

      const user = {
        _id: action.payload._id,
        full_name: action.payload.full_name,
        role: action.payload.role,
        room_id: action.payload.room_id,
        shifts: action.payload.shifts,
      };

      console.log("Async storage saves user");
      console.log(user);
      // Store user data in AsyncStorage
      const saveData = async ()=>{

        await SecureStore.setItemAsync("user", JSON.stringify(user))
          .then(() => console.log("User stored in SecureStore"))
          .catch((error) => console.error("Error storing user:", error));
      }
      saveData()
    },
    setUserToken:  (state, action) => {
      state.token = action.payload;
      SecureStore.setItemAsync("token", JSON.stringify(action.payload))
        .then(() => console.log("Token stored in SecureStore"))
        .catch((error) => console.error("Error storing token:", error));
    },
    removeUser:  (state) => {
      state.token = "";
      state._id = "";
      state.full_name = "";
      state.role = "none";
      state.room_id = null;
      state.shifts = [];
      const deleteUser = async ()=>{

        await SecureStore.deleteItemAsync("user")
          .then(() => console.log("User removed from SecureStore"))
          .catch((error) => console.error("Error removing user:", error));
      }
      const deleteToken = async ()=>{

        await SecureStore.deleteItemAsync("token")
          .then(() => console.log("Token removed from SecureStore"))
          .catch((error) => console.error("Error removing user:", error));
      }
      deleteUser()
      deleteToken()
      AsyncStorage.clear()
    },
    removeUsersRoomId: (state) => {
      state.room_id = null;
    },
    initializeUserState:  (state, action) => {
      console.log(action.payload);
      console.log(action.payload.full_name);
      state.token = action.payload.token || "";
      state._id = action.payload._id || "";
      state.full_name = action.payload.full_name || "";
      state.role = action.payload.role || "none";
      state.shifts = action.payload.shifts || [];
      state.room_id = action.payload.roomId || null
      
    },
  },
});

export const {
  setUser,
  removeUser,
  setUserToken,
  removeUsersRoomId,
  setScheduleId,
  initializeUserState,
} = userSlice.actions;

export default userSlice.reducer;
