import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // for token storage
import { ROUTES, VARS } from "../constants";
import store from "../store";
import { removeUser, setUserToken } from "../store/reducers/userReducer";
import { navigate } from "./navigationService"; // Custom navigation service for redirecting to login
import { removeRoom } from "../store/reducers/roomReducer";
import * as SecureStore from 'expo-secure-store';

// Create an Axios instance
const api = axios.create({
  baseURL: VARS.API_URL, // Your API base URL
});

// Function to get the access token from storage
const getAccessToken = async () => {
  try {
      let token = await SecureStore.getItemAsync("token");
      token = token.replace(/"/g, "");
    return token.toString();
  } catch (e) {
    console.log("Error fetching access token:", e);
    return null;
  }
};

// Request Interceptor - Attach access token to each request
api.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle token expiration and 401 errors
api.interceptors.response.use(
  async (response) => {
    // If the response contains a new token, update storage
    const newToken = response.headers["authorization"]?.split(" ")[1]; 
    const currentToken = await getAccessToken();

    if (newToken && newToken !== currentToken) {
      // Update the token in AsyncStorage
      await SecureStore.setItemAsync("token", newToken);
      store.dispatch(setUserToken(newToken));
      console.log("Access token updated.");
    }
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid -> Clear Redux state and redirect to login
      console.log("Token expired or invalid. Redirecting to login.");

      // Clear AsyncStorage and Redux state
      store.dispatch(removeUser()); 
      store.dispatch(removeRoom());

      navigate(ROUTES.LOGIN); 
    }
    return Promise.reject(error);
  }
);

export default api;
