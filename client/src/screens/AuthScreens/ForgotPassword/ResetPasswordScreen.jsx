import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,KeyboardAvoidingView,Platform
} from "react-native";
import { useToast } from "react-native-toast-notifications";
import { COLORS, ROUTES, STYLES, VARS } from "../../../constants";
import LogoImage from "../../../../assets/images/logo.png";
import api from "../../../utils/requstInterceptor";

const ResetPasswordScreen = ({ route, navigation }) => {
  const toast = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { userId } = route.params; // Receiving userId from route params

  const handlePasswordReset = async () => {
    if (newPassword === "" || confirmPassword === "") {
      toast.show("Please fill in both password fields.", {
        type: "warning",
        placement: "bottom",
        duration: 4000,
        offset: 30,
        animationType: "slide-in",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.show("Passwords do not match.", {
        type: "danger",
        placement: "bottom",
        duration: 4000,
        offset: 30,
        animationType: "slide-in",
      });
      return;
    }

    try {
      setLoading(true);
      const { data: response } = await api.post(`${VARS.API_URL}/auth/reset-password`, {
        userId,
        newPassword: newPassword,
      });

      if (response.success) {
        toast.show("Password reset successfully!", {
          type: "success",
          placement: "bottom",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });
        navigation.navigate(ROUTES.LOGIN); // Navigate to login screen after successful password reset
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
      toast.show("Error resetting password. Please try again.", {
        type: "danger",
        placement: "bottom",
        duration: 4000,
        offset: 30,
        animationType: "slide-in",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
      <KeyboardAvoidingView  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={STYLES.container}>
    
      <Image source={LogoImage} style={styles.logo} />
      <ActivityIndicator animating={loading} size="large" />

      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        style={styles.input}
        placeholder="New password"
        secureTextEntry={true}
        onChangeText={(text) => setNewPassword(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm new password"
        secureTextEntry={true}
        onChangeText={(text) => setConfirmPassword(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
        <Text style={styles.buttonText}>Reset Password</Text>
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

export default ResetPasswordScreen;
