import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,Keyboard // Import Image component from react-native
} from "react-native";
import { COLORS, ROUTES, VARS } from "../../constants";

// Import your logo image
import LogoImage from "../../../assets/images/logo.png";
import axios from "axios";
import { useToast } from "react-native-toast-notifications";
import DeveloperSignature from "../../components/Utils/DeveloperSignature";
import LoadingComponent from "../../components/Utils/LoadingComponent";

const SignupScreen = ({ navigation }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const handleSignup = async () => {
    Keyboard.dismiss()
    setLoading(true);
    try {
      if (
        fullName == "" ||
        email == "" ||
        password == "" ||
        confirmPassword == ""
      ) {
        toast.show("Please fill in all fields.", {
          type: "warning",
          placement: "bottom",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });

        return;
      }

      if (password !== confirmPassword) {
        toast.show("Passwords do not match.", {
          type: "warning",
          placement: "bottom",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });
        return;
      }
      console.log(VARS.API_URL);
      const response = await axios.post(`${VARS.API_URL}/auth/signup`, {
        email,
        password,
        fullName,
      });

      if (!response.data.success) {
        toast.show(response.data.msg, {
          type: "danger",
          placement: "bottom",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });
      } else {
        toast.show("Verification email has been sended", {
          type: "success",
          placement: "bottom",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error("Server Error:", error.response.data);
        toast.show("Server Error. Please try again later.", {
          type: "danger",
          placement: "bottom",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No Response:", error.request);
        toast.show("No response from server. Please check your connection.", {
          type: "danger",
          placement: "bottom",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });
      } else {
        // Something else happened in making the request
        console.error("Error:", error.message);
        toast.show("Error occurred while signing up.", {
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

  const goToLogin = () => {
    navigation.navigate(ROUTES.LOGIN);
  };

  return (
    <View style={styles.container}>
      <LoadingComponent isLoading={loading}/>
      <Image source={LogoImage} style={styles.logo} />
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Full name"
        onChangeText={(text) => setFullName(text)}
      />
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
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        onChangeText={(text) => setConfirmPassword(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={goToLogin}>
        <Text style={styles.loginLink}>
          Do you already have an account? Login here.
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
    width: 250, // Adjust width as needed
    height: 250, // Adjust height as needed
    marginBottom: 20,
    resizeMode: "contain", // Ensure the logo scales correctly
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
  loginLink: {
    marginTop: 20,
    color: "#007BFF",
  },
});

export default SignupScreen;
