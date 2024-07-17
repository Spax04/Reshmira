// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { createSlice } from '@reduxjs/toolkit';

// export const userSlice = createSlice({
//   name: 'user',
//   initialState: {
//     token: '',
//     userid: '',
//     username: ''
//   },
//   reducers: {
//     setUser: (state, action) => {
//       state.token = action.payload.token;
//       state.userid = action.payload.userid;
//       state.username = action.payload.username;
//       const user = {
//         token: action.payload.token,
//         userid: action.payload.userid,
//         username: action.payload.username
//       };

//       // Store user data in AsyncStorage
//       AsyncStorage.setItem('user', JSON.stringify(user))
//         .then(() => console.log('User stored in AsyncStorage'))
//         .catch(error => console.error('Error storing user:', error));
//     },
//     removeUser: state => {
//       state.token = '';
//       state.userid = '';
//       state.username = '';

//       // Remove user data from AsyncStorage
//       AsyncStorage.removeItem('user')
//         .then(() => console.log('User removed from AsyncStorage'))
//         .catch(error => console.error('Error removing user:', error));
//     }
//   }
// });

// export const { setUser, removeUser } = userSlice.actions;

// export default userSlice.reducer;
