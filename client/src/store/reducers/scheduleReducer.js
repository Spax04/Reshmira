import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    _id: null,
    name: "",
    users: [],
    shifts: [],
    guards_pre_shift: null,
    positions: [],
    shift_time: null,
    createdAt:null,
    updatedAt: null,
};

export const scheduleSlice = createSlice({
    name: "schedule",
    initialState,
    reducers: {
        setSchedule: (state, action) => {

            console.log(action.payload);

            state._id = action.payload._id;
            state.name = action.payload.name;
            state.users = action.payload.guards;
            state.shifts = action.payload.shifts;
            state.guards_pre_shift = action.payload.guards_pre_shift;
            state.shift_time = action.payload.shift_time;
            state.positions = action.payload.positions;
            state.createdAt = action.payload.createdAt;
            state.updatedAt = action.payload.updatedAt;

            const schedule = {
                _id: action.payload._id,
                name: action.payload.name,
                users: action.payload.users,
                shifts: action.payload.shifts,
                guards_pre_shift: action.payload.guards_pre_shift,
                shift_time: action.payload.shift_time,
                positions: action.payload.positions,
                createdAt: action.payload.createdAt,
                updatedAt: action.payload.updatedAt,
            };

            AsyncStorage.setItem("schedule", JSON.stringify(schedule))
                .then(() => console.log("Schedule data stored in AsyncStorage"))
                .catch((error) => console.error("Error storing schedule:", error));
        },
        scheduleRemove: (state) => {
            state._id = null
            state.name = ""
            state.users = []
            state.shifts = []
            state.guards_pre_shift = null
            state.shift_time = null
            state.positions = []
            state.createdAt = null
            state.updatedAt = null


            AsyncStorage.removeItem("schedule")
                .then(() => console.log("Schedule data removed from AsyncStorage"))
                .catch((error) => console.error("Error removing schedule:", error));
        },
        setShiftsList: (state, action) => {
            state.shifts = action.payload;
        },
        initializeScheduleState: (state, action) => {
            state._id = action.payload._id || null
            state.name = action.payload.name || ""
            state.users = action.payload.users || []
            state.shifts = action.payload.shifts || []
            state.guards_pre_shift = action.payload.guards_pre_shift || null
            state.shift_time = action.payload.shift_time || null
            state.positions = action.payload.positions || []
            state.createdAt = action.payload.createdAt || null
            state.updatedAt = action.payload.updatedAt || null
        },
    },
});

export const { setSchedule, setShiftsList, scheduleRemove, initializeScheduleState } =
    scheduleSlice.actions;

export default scheduleSlice.reducer;
