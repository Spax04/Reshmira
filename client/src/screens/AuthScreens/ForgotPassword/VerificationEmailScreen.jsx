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

const VerificationEmailScreen = ({ route, navigation }) => {
    const toast = useToast();
    const [verificationCode, setVerificationCode] = useState("");
    const [loading, setLoading] = useState(false);
    const { userId } = route.params; // Receiving userId from route params

    const handleVerification = async () => {
        if (verificationCode === "") {
            toast.show("Please enter the verification code.", {
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
            console.log(userId);
            const { data: response } = await api.post(`${VARS.API_URL}/auth/verify-code/`, {
                userId,
                code: verificationCode,
            });

            if (response.success) {
                toast.show("Email verified successfully!", {
                    type: "success",
                    placement: "bottom",
                    duration: 4000,
                    offset: 30,
                    animationType: "slide-in",
                });
                console.log(response.data.userId);
                navigation.navigate(ROUTES.RESET_PASSWORD, { userId: response.data.userId }); // Navigate to reset password or login screen
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
            toast.show("Error verifying email. Please try again.", {
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

            <Text style={styles.title}>Verify Email</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter verification code"
                onChangeText={(text) => setVerificationCode(text)}
                keyboardType="number-pad"
            />
            <TouchableOpacity style={styles.button} onPress={handleVerification}>
                <Text style={styles.buttonText}>Verify</Text>
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

export default VerificationEmailScreen;
