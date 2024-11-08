import { StyleSheet, Text, View, TouchableOpacity, TextInput, Platform, ScrollView, Modal } from 'react-native'
import React, { useState } from 'react'
import { COLORS, ROUTES } from '../../constants'
import AccordionItem from '../../components/Utils/AccordionItem'
import Animated, {
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

import Feather from '@expo/vector-icons/Feather';
import { useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import { Button, ListItem, } from 'react-native-elements'
import { Switch } from '@rneui/themed';
import UserListItem from '../../components/UserListItem';

const AdminSettings = ({ navigation }) => {
    const guardsOpen = useSharedValue(false);

    const [showExtendModal, setShowExtendModal] = useState(false)
    const [showUserModel, setShowUserModel] = useState(false)

    const [extendScheduleDays, setExtendScheduleDays] = useState(0)
    const [currentUserToSetup, setCurrentUserToSetup] = useState({})

    const schedule = useSelector(state => state.schedule)
    const guardsOnPress = () => {
        guardsOpen.value = !guardsOpen.value;
    };
    const extendOnPress = () => {
        setShowExtendModal(true)
    };

    const handleExtendDays = (days) => {
        setExtendScheduleDays(Number(days))
        if (Platform.OS === 'android') {
            setShowExtendModal(false); // Close modal when time is picked on Android
        }
    }
    const handleDeleteSchedule = async () => {

    }
    const handleExtendSchedule = async () => {

    }

    const handleRemoveUser = async (userId) => {

    }

    const handleRemoveUserTemp = async (user) => {

    }
    const handleSetupUser = async (user) => {
        setShowUserModel(true)
        console.log("User id setup: ");
        console.log(user._id);
        console.log(user.fullName);
        setCurrentUserToSetup(user)
    }
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.mainSettingsContainer}>
                        <TouchableOpacity
                            style={styles.extendButton}
                            onPress={extendOnPress}
                        >
                            <Text style={styles.buttonText}>Extend Schedule</Text>
                        </TouchableOpacity>
                        <Modal
                            transparent={true}
                            animationType="slide"
                            visible={showExtendModal}
                            onRequestClose={() => setShowExtendModal(false)}
                        >
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <Text style={styles.modalTitle}>Extend Schedule</Text>
                                    <Text style={styles.modalText}>Choose duration (days):</Text>
                                    <Picker
                                        selectedValue={extendScheduleDays}
                                        style={styles.pickerStyle}
                                        onValueChange={(itemValue) => setExtendScheduleDays(itemValue)}
                                    >
                                        <Picker.Item label="1" value={1} />
                                        <Picker.Item label="2" value={2} />
                                        <Picker.Item label="3" value={3} />
                                        <Picker.Item label="4" value={4} />
                                        <Picker.Item label="5" value={5} />
                                    </Picker>
                                    <TouchableOpacity
                                        style={styles.modalButton}
                                        onPress={() => setShowExtendModal(false)}
                                    >
                                        <Text style={styles.modalButtonText}>Done</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>

                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={handleDeleteSchedule}
                        >
                            <Text style={styles.buttonText}>Delete Schedule</Text>
                        </TouchableOpacity>
                    </View>

                    {/* User List */}
                    <View style={styles.parent}>
                        <Text style={styles.nameText}>Guards</Text>
                        {schedule.users.map(u =>
                            <UserListItem key={u._id} item={u} onDelete={handleRemoveUser} onSuspend={handleRemoveUserTemp} />
                        )}
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

export default AdminSettings

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 15,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    backButton: {
        padding: 5,
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: COLORS.MAIN,
        textAlign: 'center',
        flex: 1,
    },
    scrollView: {
        width: "100%",
    },
    mainSettingsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
    },
    nameText: {
        fontSize: 22,
        color: "#333",
        fontWeight: 'bold',
        marginVertical: 10,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    deleteButton: {
        width: "45%",
        height: 50,
        backgroundColor: COLORS.mainRed,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
    },
    buttonText: {
        color: COLORS.whiteText,
        fontSize: 16,
        fontWeight: "600",
    },
    extendButton: {
        width: "45%",
        height: 50,
        backgroundColor: COLORS.mainBlue,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
        backgroundColor: "#fff",
        marginHorizontal: 30,
        borderRadius: 12,
        padding: 20,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: COLORS.MAIN,
        marginBottom: 15,
    },
    modalText: {
        fontSize: 16,
        color: "#333",
        marginBottom: 15,
        textAlign: "center",
    },
    modalButton: {
        marginTop: 15,
        backgroundColor: COLORS.neutralLight,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    modalButtonText: {
        color: "#333",
        fontSize: 16,
        fontWeight: "600",
    },
    pickerStyle: {
        width: "100%",
    },
});
