import { Button, StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { COLORS } from '../../constants'
import AccordionItem from '../../components/Utils/AccordionItem'
import Animated, {
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import Feather from '@expo/vector-icons/Feather';
import { useSelector } from 'react-redux';


const AdminSettings = () => {
    const guardsOpen = useSharedValue(false);
    const extendOpen = useSharedValue(false);

    const [extendScheduleDays, setExtendScheduleDays] = useState(0)

    const schedule = useSelector(state => state.schedule)
    const guardsOnPress = () => {
        guardsOpen.value = !guardsOpen.value;
    };
    const extendOnPress = () => {
        extendOpen.value = !extendOpen.value;
    };
    const handleDeleteSchedule = async () => {

    }
    const handleExtendSchedule = async () => {

    }
    const handleSetupUser = async () => {

    }
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <ScrollView style={styles.scrollView}>


                    <TouchableOpacity
                        style={styles.extendButton}
                        onPress={guardsOnPress}
                    >
                        <Text style={styles.buttonText}>Guards</Text>
                    </TouchableOpacity>
                    <View style={styles.parent}>
                        <AccordionItem isExpanded={guardsOpen} viewKey="Accordion">
                            <View >
                                {schedule.users.map(u =>
                                    <View style={styles.userContainer}>
                                        <Text style={styles.nameText}>{u.fullName}</Text>
                                        <TouchableOpacity
                                            style={styles.userSetupButton}
                                            onPress={() => handleSetupUser(u._id)}
                                        >
                                            <Feather name="settings" size={24} color="black" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        </AccordionItem>
                    </View>
                    <TouchableOpacity
                        style={styles.extendButton}
                        onPress={extendOnPress}
                    >
                        <Text style={styles.buttonText}>Extend Schedule</Text>
                    </TouchableOpacity>
                    <View style={styles.parent}>
                        <AccordionItem isExpanded={extendOpen} viewKey="Accordion">
                            <View>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter number of guards"
                                    keyboardType="numeric"
                                    value={extendScheduleDays}
                                    onChangeText={setExtendScheduleDays}
                                />
                                <TouchableOpacity
                                    style={styles.handleButton}
                                    onPress={handleExtendSchedule}
                                >
                                    <Text style={styles.buttonText}>Accept</Text>
                                </TouchableOpacity>
                            </View>
                        </AccordionItem>
                    </View>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDeleteSchedule}
                    >
                        <Text style={styles.buttonText}>Delete Schedule</Text>
                    </TouchableOpacity>
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
    nameText: {
        fontSize: 18,
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
    },
    parent: {
        width: "90%",
        borderRadius: 8,
        backgroundColor: '#f8f8f8',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2
    },
    deleteButton: {
        width: "100%",
        height: 50,
        backgroundColor: COLORS.mainRed,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        marginBottom: 20,
        marginTop: 20
    },
    buttonText: {
        color: COLORS.whiteText,
        fontSize: 18,
        fontWeight: "bold",
    },
    extendButton: {
        width: "100%",
        height: 50,
        backgroundColor: COLORS.greenSubmit,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        marginBottom: 20,
        marginTop: 20
    },
    handleButton: {
        backgroundColor: "#f39c12",
    }
})