import { StyleSheet, Text, View, TouchableOpacity, TextInput, Platform, ScrollView, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, ROUTES, VARS } from '../../constants'
import AccordionItem from '../../components/common/AccordionItem'
import Animated, {
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import api from "../../utils/requstInterceptor";
import { useToast } from "react-native-toast-notifications";
import Feather from '@expo/vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import { Button, ListItem, } from 'react-native-elements'
import { Switch } from '@rneui/themed';
import UserListItem from '../../components/UserListItem';
import AnimatedSVG from '../../components/Utils/LoadingComponent';
import LoadingComponent from '../../components/Utils/LoadingComponent';
import { removeRoom } from '../../store/reducers/roomReducer';
import { removeSchedule } from '../../store/reducers/scheduleReducer';
import { removeUsersRoomId } from '../../store/reducers/userReducer';
import { setSchedule,setShiftsList } from '../../store/reducers/scheduleReducer';

const AdminSettings = ({ navigation }) => {
    const guardsOpen = useSharedValue(false);
    const room = useSelector(state => state.room)
    const schedule = useSelector(state => state.schedule)
    const toast = useToast();
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        console.log(schedule.users);
    }, [])
    const dispatch = useDispatch()

    const [showExtendModal, setShowExtendModal] = useState(false)
    const [showDeleteScheduleModal, setShowDeleteScheduleModal] = useState(false)
    const [showUserModel, setShowUserModel] = useState(false)

    const [extendScheduleDays, setExtendScheduleDays] = useState(0)
    const [currentUserToSetup, setCurrentUserToSetup] = useState({})

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
        setShowDeleteScheduleModal(false)
        setLoading(true)

        try {

            const { data: response } = await api.delete(`${VARS.API_URL}/schedule/${schedule._id}/${room._id}`)

            if (response.success) {
                toast.show("Schedule was deleted successfuly!", {
                    type: "success",
                    placement: "bottom",
                    duration: 4000,
                    offset: 30,
                    animationType: "slide-in",
                });

                dispatch(removeRoom())
                dispatch(removeSchedule())
                dispatch(removeUsersRoomId())

                navigation.navigate(ROUTES.ROOM_STACK, { screen: ROUTES.LOBBY_ROOM })
            } else {
                toast.show(response.msg, {
                    type: "warning",
                    placement: "bottom",
                    duration: 4000,
                    offset: 30,
                    animationType: "slide-in",
                });

            }
        } catch (err) {

            toast.show("Error on deleting schedule: ", err, {
                type: "danger",
                placement: "bottom",
                duration: 4000,
                offset: 30,
                animationType: "slide-in",
            });
        } finally {
            setLoading(false)
        }
    }
    const handleExtendSchedule = async () => {

        setShowExtendModal(false)
        setLoading(true)
        try{

            const {data: response} = await api.post(`${VARS.API_URL}/schedule/extend`,
                {
                    scheduleId: schedule._id,
                    extendDays: extendScheduleDays
                }
            )

            if(response.success){
                toast.show(response.msg, {
                    type: "success",
                    placement: "bottom",
                    duration: 4000,
                    offset: 30,
                    animationType: "slide-in",
                });
                const { data: scheduleResponse } = await api.get(`${VARS.API_URL}/schedule/${room.scheduleId}`)
                console.log(scheduleResponse)
                if (scheduleResponse.success) {
                    console.log("SHEDULE RESPONSE:")
                    console.log(scheduleResponse.data);

                    const { data: shiftResponse } = await api.post(`${VARS.API_URL}/shift/get-list/`, { shiftsIds: scheduleResponse.data.shifts })
                    scheduleResponse.data.shifts = []
                    dispatch(setSchedule(scheduleResponse.data))
                    console.log(shiftResponse.data);
                    dispatch(setShiftsList(shiftResponse.data))
                }
            }
        }catch (err){
            console.error(err.message);
            toast.show("Error on extending schedule. Try again later!", {
                type: "danger",
                placement: "bottom",
                duration: 4000,
                offset: 30,
                animationType: "slide-in",
            });
            
        }finally{
            setLoading(false)
        }

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

            <LoadingComponent isLoading={loading} />
            <View style={styles.content}>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.mainSettingsContainer}>
                        <TouchableOpacity
                            style={styles.extendButton}
                            onPress={extendOnPress}
                        >
                            <Text style={styles.buttonText}>להאריך רשימה </Text>
                        </TouchableOpacity>
                        <Modal
                            transparent={true}
                            animationType="slide"
                            visible={showExtendModal}
                            onRequestClose={() => setShowExtendModal(false)}
                        >
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <Text style={styles.modalTitle}>להאריך רשימת שמירות</Text>
                                    <Text style={styles.modalText}>שמירות שפג תוקף ימחקו המרשימה</Text>
                                    <Text style={styles.modalText}>תבחר כמות הימים:</Text>
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
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                                        <TouchableOpacity
                                            style={styles.modalButton}
                                            onPress={() => setShowExtendModal(false)}
                                        >
                                            <Text style={styles.modalButtonText}>ביטול</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{
                                                marginTop: 15,
                                                backgroundColor: COLORS.greenSubmit,
                                                paddingVertical: 10,
                                                paddingHorizontal: 20,
                                                borderRadius: 8,
                                            }}
                                            onPress={() => handleExtendSchedule()}
                                        >
                                            <Text style={styles.modalButtonText}>סיים</Text>
                                        </TouchableOpacity>
                                      
                                    </View>
                                </View>
                            </View>
                        </Modal>

                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => setShowDeleteScheduleModal(true)}
                        >
                            <Text style={styles.buttonText}>למחוק לו"ז</Text>
                        </TouchableOpacity>
                        <Modal
                            transparent={true}
                            animationType="slide"
                            visible={showDeleteScheduleModal}
                            onRequestClose={() => setShowDeleteScheduleModal(false)}
                        >
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <Text style={styles.modalTitle}>למחוק לו"ז</Text>
                                    <Text style={styles.modalText}>את\ה בטוח\ה שרוצה למחוק את הרשימה?</Text>

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>

                                    <TouchableOpacity
                                            style={styles.modalButton}
                                            onPress={() => setShowDeleteScheduleModal(false)}
                                        >
                                            <Text style={styles.modalButtonText}>ביטול</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{
                                                marginTop: 15,
                                                backgroundColor: COLORS.mainRed,
                                                paddingVertical: 10,
                                                paddingHorizontal: 20,
                                                borderRadius: 8,
                                            }}
                                            onPress={() => handleDeleteSchedule()}
                                        >
                                            <Text style={styles.buttonText}>כן</Text>
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </View>

                    {/* User List */}
                    <View style={styles.parent}>
                        <Text style={styles.nameText}>שומרים</Text>
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
