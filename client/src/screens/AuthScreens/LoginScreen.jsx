import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { useToast } from "react-native-toast-notifications";
import DeveloperSignature from "../../components/Utils/DeveloperSignature";
import { COLORS, ROUTES, VARS } from "../../constants";
import LogoImage from "../../../assets/images/logo.png";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setUserToken } from "../../store/reducers/userReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setRoom } from "../../store/reducers/roomReducer";
import api from "../../utils/requstInterceptor";

const LoginScreen = ({ navigation }) => {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const storedToken = await AsyncStorage.getItem("token");

        console.log("USER ON LOGIN CHECK");
        console.log(storedUser);
        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser);
          const parsedToken = JSON.parse(storedToken);
          if (parsedUser._id && parsedToken) {
            dispatch(setUser(parsedUser));
            dispatch(setUserToken(parsedToken));
            navigation.navigate(ROUTES.HOME);
          }
        }
      } catch (error) {
        console.error("Error checking stored user:", error);
      }
    };
    checkUser();
  }, []);

  const handleLogin = async () => {
    try {
      if (email == "" || password == "") {
        toast.show("Please fill in all fields.", {
          type: "warning",
          placement: "bottom",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });
        return;
      }

      setLoading(true);
      const { data: loginResponse } = await api.post(
        `${VARS.API_URL}/auth/login`,
        {
          email,
          password,
        }
      );

      if (!loginResponse.success) {
        toast.show(loginResponse.msg, {
          type: "danger",
          placement: "bottom",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });
      } else {
        toast.show("Login successfully!", {
          type: "success",
          placement: "bottom",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });

        dispatch(setUserToken(loginResponse.data));
        try {
          console.log(loginResponse.data);
          const { data: userSelfResponse } = await api.get(
            `${VARS.API_URL}/user`
          );

          if (!userSelfResponse.success) {
            toast.show(userSelfResponse.msg, {
              type: "success",
              placement: "bottom",
              duration: 4000,
              offset: 30,
              animationType: "slide-in",
            });
          } else {
            dispatch(setUser(userSelfResponse.data));
            console.log(userSelfResponse.data.token);

            if (userSelfResponse.data.room_id !== null) {
              const { data: usersRoomData } = await api.get(
                `${VARS.API_URL}/room/${userSelfResponse.data.room_id}`
              );

              if (usersRoomData.success) {
                dispatch(setRoom(usersRoomData.data));
              }
            }
            navigation.navigate(ROUTES.HOME);
          }
        } catch (err) {
          toast.show(err.message, {
            type: "danger",
            placement: "bottom",
            duration: 4000,
            offset: 30,
            animationType: "slide-in",
          });
        }
      }
    } catch (error) {
      if (error.response) {
        console.error("Server Error:", error.response.data);
        toast.show(error.response.data.msg, {
          type: "danger",
          placement: "bottom",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });
      } else if (error.request) {
        console.error("No Response:", error.request);
        toast.show("No response from server. Please check your connection.", {
          type: "danger",
          placement: "bottom",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });
      } else {
        console.error("Error:", error.message);
        toast.show("Error occurred while logging in.", {
          type: "danger",
          placement: "bottom",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const goToSignup = () => {
    navigation.navigate(ROUTES.SIGNUP); // Navigate to SignupScreen
  };

  const goToForgotPassword = () => {
    navigation.navigate(ROUTES.FORGOT_PASSWORD)
  }

  return (
    <View style={styles.container}>
      <Image source={LogoImage} style={styles.logo} />
      <ActivityIndicator animating={loading} size="large" />

      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={goToSignup}>
        <Text style={styles.signupLink}>
          Don't have an account? Sign up here
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={goToForgotPassword}>
        <Text style={styles.signupLink}>
          Forgot password?
        </Text>
      </TouchableOpacity>
      <DeveloperSignature/>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#EEE",
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.mainYellowL,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: COLORS.mainDark,
    fontSize: 18,
    fontWeight: "bold",
  },
  signupLink: {
    marginTop: 20,
    color: "#007BFF",
  },
});

export default LoginScreen;
