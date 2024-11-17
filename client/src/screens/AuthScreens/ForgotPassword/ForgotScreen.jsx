import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,KeyboardAvoidingView,Platform
} from "react-native";
import { useToast } from "react-native-toast-notifications";
import { COLORS, ROUTES, STYLES, VARS } from "../../../constants";
import LogoImage from "../../../../assets/images/logo.png";
import api from "../../../utils/requstInterceptor";

const ForgotPasswordScreen = ({ navigation }) => {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (email === "") {
      toast.show("Please enter your email.", {
        type: "warning",
        placement: "bottom",
        duration: 4000,
        offset: 30,
        animationType: "slide-in",
      });
      return;
    }

    try {
      setLoading(true);
      const { data: response } = await api.post(`${VARS.API_URL}/auth/forgot-password/`, { email });

      if (response.success) {
        toast.show("Reset code sent! Please check your email.", {
          type: "success",
          placement: "bottom",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });
        navigation.navigate(ROUTES.VERIFY_EMAIL,{ userId: response.data.userId });
      } else {
        toast.show(response.msg, {
          type: "danger",
          placement: "bottom",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });
      }
    } catch (error) {
      toast.show("Error sending reset code. Please try again later.", {
        type: "danger",
        placement: "bottom",
        duration: 4000,
        offset: 30,
        animationType: "slide-in",
      });
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={STYLES.container}>
   
      <Image source={LogoImage} style={styles.logo} />
      <ActivityIndicator animating={loading} size="large" />

      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
      />
      <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate(ROUTES.LOGIN)}>
        <Text style={styles.loginLink}>Back to Login</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
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
  loginLink: {
    marginTop: 20,
    color: "#007BFF",
  },
});

export default ForgotPasswordScreen;
