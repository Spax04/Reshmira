import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
  _id: "",
  fullName: "",
  role: "none",
  roomId: null,
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
      state.fullName = action.payload.full_name;
      state.role = action.payload.role;
      state.roomId = action.payload.room_id;
      state.shifts = [...action.payload.shifts];

      const user = {
        _id: action.payload._id,
        fullName: action.payload.full_name,
        role: action.payload.role,
        roomId: action.payload.room_id,
        shifts: action.payload.shifts,
      };

      console.log("Async storage saves user");
      console.log(user);
      // Store user data in AsyncStorage
      const saveData = async ()=>{

        await AsyncStorage.setItem("user", JSON.stringify(user))
          .then(() => console.log("User stored in AsyncStorage"))
          .catch((error) => console.error("Error storing user:", error));
      }
      saveData()
    },
    setUserToken:  (state, action) => {
      state.token = action.payload;
       AsyncStorage.setItem("token", JSON.stringify(action.payload))
        .then(() => console.log("Token stored in AsyncStorage"))
        .catch((error) => console.error("Error storing token:", error));
    },
    removeUser:  (state) => {
      state.token = "";
      state._id = "";
      state.fullName = "";
      state.role = "none";
      state.roomId = null;
      state.shifts = [];
      // Remove user data from AsyncStorage
       AsyncStorage.removeItem("user")
        .then(() => console.log("User removed from AsyncStorage"))
        .catch((error) => console.error("Error removing user:", error));
       AsyncStorage.clear()
    },
    removeUsersRoomId: (state) => {
      state.roomId = null;
    },
    initializeUserState:  (state, action) => {
      console.log(action.payload);
      console.log(action.payload.fullName);
      state.token = action.payload.token || "";
      state._id = action.payload._id || "";
      state.fullName = action.payload.fullName || "";
      state.role = action.payload.role || "none";
      state.shifts = action.payload.shifts || [];
      state.roomId = action.payload.roomId || null
      
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
