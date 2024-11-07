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

    const handleRemoveUser = async (user) => {

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
                <Button title="Back" type="outline" onPress={() => navigation.goBack()} />
                <ScrollView style={styles.scrollView}>
                    <View style={styles.mainSettingsContainer}>

                        <Button
                            title="Extend schedule"
                            onPress={extendOnPress}
                        />
                        <Modal
                            transparent={true}
                            animationType="slide"
                            visible={showExtendModal}
                            onRequestClose={() => setShowExtendModal(false)}
                        >
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <Text style={styles.nameText}>Choose for how long do you want to extend schedule.</Text>
                                    <Picker
                                        selectedValue={extendScheduleDays}
                                        style={styles.pickerStyle}
                                        onValueChange={(itemValue, itemIndex) =>
                                            setExtendScheduleDays(itemValue)
                                        }>
                                        <Picker.Item label="1" value={1} />
                                        <Picker.Item label="2" value={2} />
                                        <Picker.Item label="3" value={3} />
                                        <Picker.Item label="4" value={4} />
                                        <Picker.Item label="5" value={5} />
                                    </Picker>
                                    {Platform.OS === 'ios' && (
                                        <TouchableOpacity
                                            style={styles.modalButton}
                                            onPress={() => setShowExtendModal(false)}
                                        >
                                            <Text style={styles.modalButtonText}>Done</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        </Modal>

                        <Button
                            title="Delete schedule"
                            onPress={handleDeleteSchedule}
                        />
                    </View>


                    <View >
                        <View style={styles.parent}>
                            {schedule.users.map(u =>
                                <View key={u._id}  style={styles.userContainer}>
                                    
                                    <Text style={styles.nameText}>{u.fullName}</Text>
                                    <TouchableOpacity
                                        style={styles.userSetupButton}
                                        onPress={() => handleSetupUser(u)}
                                    >
                                        <Feather name="settings" size={24} color="black" />
                                    </TouchableOpacity>
                                    <Modal
                                        transparent={true}
                                        animationType="slide"
                                        visible={showUserModel}
                                        onRequestClose={() => setShowUserModel(false)}
                                    >
                                        <View style={styles.modalContainer}>
                                            <View style={styles.modalContent}>
                                                <View style={{ marginBottom: 20 }}>
                                                    <Text style={styles.nameText}>{currentUserToSetup.fullName}</Text>
                                                </View>
                                                <View style={styles.userSetupContainer}>
                                                    <TouchableOpacity
                                                        style={styles.deleteButton}
                                                        onPress={() => handleRemoveUser(currentUserToSetup)}
                                                    >
                                                        <Text style={styles.buttonText}>Kick</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={styles.extendButton}
                                                        onPress={() => handleRemoveUserTemp(currentUserToSetup)}
                                                    >
                                                        <Text style={styles.buttonText}>Temp halt</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                {Platform.OS === 'ios' && (
                                                    <TouchableOpacity
                                                        style={styles.modalButton}
                                                        onPress={() => setShowUserModel(false)}
                                                    >
                                                        <Text style={styles.modalButtonText}>Back</Text>
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        </View>
                                    </Modal>
                                </View>
                                
                            )}
                        </View>
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
        backgroundColor: "#f0f0f0",
    },

    scrollView: {
        width: "100%"
    },
    mainSettingsContainer: {
        display: "flex",
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 20
    },
    nameText: {
        fontSize: 24,
        color: "#555",

    },
    userSetupButton: { marginRight: 10, },
    userContainer: {
        backgroundColor: "#fff",
        padding: 15,
        marginVertical: 8,
        borderRadius: 10,
        width: "100%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
        display: 'flex',
        flexDirection: "row",
        justifyContent: "space-between"
    },
    userContent: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 25,
        marginLeft: 35,
        marginRight: 35,
        paddingTop: 50
    },
    parent: {
        width: "100%",
        borderRadius: 8,

    },
    deleteButton: {
        width: "40%",
        height: 50,
        backgroundColor: COLORS.mainRed,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
    },
    guardsButton: {
        width: "100%",
        height: 50,
        backgroundColor: COLORS.neutralDark,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        marginBottom: 20,
        marginTop: 20,
        padding: 10
    },
    buttonText: {
        color: COLORS.whiteText,
        fontSize: 15,
        fontWeight: "bold",
    },
    extendButton: {
        width: "40%",
        height: 50,
        backgroundColor: COLORS.mainOrange,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
    },
    handleButton: {
        backgroundColor: "#f39c12",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dimmed background
    },
    modalContent: {
        backgroundColor: "#fff",
        margin: 40,
        borderRadius: 15,
        padding: 40,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    modalButton: {
        marginTop: 20,
        backgroundColor: "#D3D3D3", // Brighter color for the modal button
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    modalButtonText: {
        color: "#333",
        fontSize: 18,
        fontWeight: "bold",
    },
    pickerStyle: {
        width: "100%"
    },
    userSetupContainer: {
        width: "100%",
        display: "flex",
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 60
    }
})