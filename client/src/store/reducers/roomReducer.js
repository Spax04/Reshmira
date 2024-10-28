import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  secret: "",
  users: [],
  adminId: "",
  created_at: null,
  updated_at: null,
  scheduleId: null,
};

export const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoom: (state, action) => {

      console.log(action.payload);

      state._id = action.payload._id;
      state.secret = action.payload.secret;
      state.users = action.payload.users;
      state.adminId = action.payload.adminId;
      state.scheduleId = action.payload.schedule_id;
      state.createdAt = action.payload.created_at;
      state.updatedAt = action.payload.updated_at;

      const room = {
        _id: action.payload._id,
        secret: action.payload.secret,
        users: action.payload.users,
        adminId: action.payload.adminId,
        scheduleId: action.payload.schedule_id,
        createdAt: action.payload.created_at,
        updatedAt: action.payload.updated_at,
      };

      // Store user data in AsyncStorage
      AsyncStorage.setItem("room", JSON.stringify(room))
        .then(() => console.log("Room data stored in AsyncStorage"))
        .catch((error) => console.error("Error storing room:", error));
    },
    setScheduleId: (state, action) => {
      // Update the state with the new scheduleId
      state.scheduleId = action.payload;

      // Create the room object to save in AsyncStorage, using the current state
      const room = {
        _id: state._id,
        secret: state.secret,
        users: state.users,
        adminId: state.adminId,
        scheduleId: state.scheduleId, // Updated scheduleId
        createdAt: state.created_at, // Maintain existing properties
        updatedAt: state.updated_at,
      };

      // Store the updated room object in AsyncStorage
      AsyncStorage.setItem("room", JSON.stringify(room))
        .then(() => console.log("Room data updated in AsyncStorage"))
        .catch((error) => console.error("Error storing room:", error));
    },
    removeRoom: (state, action) => {
      state._id = "";
      state.secret = "";
      state.users = [];
      state.adminId = "";
      state.scheduleId = null;
      state.createdAt = null;
      state.updatedAt = null;

      AsyncStorage.removeItem("room")
        .then(() => console.log("Room data removed from AsyncStorage"))
        .catch((error) => console.error("Error removing room:", error));
    },
    setRoomUsers: (state, action) => {
      state.users = action.payload;
    },
    initializeRoomState: (state, action) => {
      console.log("INIT ROOM: ");

      Object.entries(action.payload).forEach(([key, value]) => {
        console.log(`${key}: ${value}`);
      });
      state._id = action.payload._id || "";
      state.secret = action.payload.secret || "";
      state.users = action.payload.users || [];
      state.adminId = action.payload.adminId || "";
      state.scheduleId = action.payload.scheduleId || null;
      state.createdAt = action.payload.created_at || null;
      state.updatedAt = action.payload.updated_at || null;
    },
  },
});

export const { setRoom, setRoomUsers, removeRoom, initializeRoomState, setScheduleId } =
  roomSlice.actions;

export default roomSlice.reducer;
