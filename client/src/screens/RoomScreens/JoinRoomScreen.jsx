import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,Keyboard
} from "react-native";
import axios from "axios";
import { COLORS, ROUTES, VARS } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setRoom } from "../../store/reducers/roomReducer";
import { useToast } from "react-native-toast-notifications";
import LoadingComponent from "../../components/Utils/LoadingComponent";

const JoinRoomScreen = () => {
  const toast = useToast()
  const navigation = useNavigation(); // Initialize the navigation hook
  const [roomCode, setRoomCode] = useState("");
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleJoinRoom = async () => {
    Keyboard.dismiss()

    if (roomCode.length !== 6) {
      toast.show("Room code must be 6 characters long.", {
        type: "warning",
        placement: "bottom",
        duration: 4000,
        offset: 30,
        animationType: "slide-in",
      });

      return;
    }

    setLoading(true);
    try {
      const { data: joinRoomData } = await axios.post(
        `${VARS.API_URL}/room/join`,
        {
          secret: roomCode,
          newParticipantId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (!joinRoomData.success) {
        toast.show(joinRoomData.msg, {
          type: "danger",
          placement: "bottom",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });
      } else {
        toast.show("Joined to room.", {
          type: "success",
          placement: "bottom",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });
        dispatch(setRoom(joinRoomData.data));
        navigation.navigate(ROUTES.GUEST_ROOM);
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
        toast.show("Error occurred while joining the room.", {
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

  return (
    <View style={styles.container}>
      <LoadingComponent isLoading={loading} />
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backBtnText}>Back</Text>
      </TouchableOpacity>
      <View style={styles.content}>

        <Text style={styles.title}>Join Room</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Room Code"
          maxLength={6}
          onChangeText={(text) => setRoomCode(text)}
        />
        <TouchableOpacity style={styles.button} onPress={handleJoinRoom}>
          <Text style={styles.buttonText}>Join Room</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default JoinRoomScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    backgroundColor: "#f0f0f0", // Light background color for better contrast
  },
  backBtn: {
    position: "absolute",
    top: 15,
    left: 15,
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
  },
  backBtnText: {
    fontSize: 16,
    color: "#000",
  },
  content: {
    flex: 1,
    justifyContent: "center", // Center align all items vertically
    alignItems: "center", // Center align all items horizontally
    marginTop: 50,
    marginLeft: 40,
    marginRight: 40, // Added margin top for better visibility
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
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
    marginBottom: 20,
  },
  buttonText: {
    color: COLORS.mainDark,
    fontSize: 18,
    fontWeight: "bold",
  },
  messageContainer: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 10,
    borderRadius: 5,
  },
  messageText: {
    color: "#FFF",
    textAlign: "center",
  },
});
