import { Animated, PanResponder, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useRef } from "react";
import { COLORS } from "../constants";
import { Switch } from "@rneui/themed";
const UserListItem = ({ item, onDelete, onSuspend, isSuspanded }) => {

    const translateX = useRef(new Animated.Value(0)).current
    const panResponder = useRef(PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
            if (gestureState.dx < 0) {
                translateX.setValue(gestureState.dx)
            }
        },
        onPanResponderRelease: (_, gestureState) => {
            if (gestureState.dx < -50) {
                Animated.spring(translateX, {
                    toValue: -100,
                    useNativeDriver: true
                }).start()
            } else if (gestureState.dx > 50) {
                Animated.spring(translateX, {
                    toValue: 100,
                    useNativeDriver: true
                }).start()
            } else {
                Animated.spring(translateX, {
                    toValue: 0,
                    useNativeDriver: true
                }).start()
            }
        }
    })).current

    return (
        <View style={styles.itemContainer}>
            <Animated.View style={{
                flex: 1,
                transform: [{ translateX: translateX }]
            }}>
                {isSuspanded ?
                    <TouchableOpacity style={styles.returnButton} onPress={() => onSuspend(item._id)}>
                        <Text style={styles.suspendButtonText}>Return</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={styles.suspendButton} onPress={() => onSuspend(item._id)}>
                        <Text style={styles.suspendButtonText}>Suspend</Text>
                    </TouchableOpacity>
                }
                <View style={styles.item} {...panResponder.panHandlers}>
                    <Text style={styles.nameText}>{item.fullName}</Text>
                </View>
                <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item._id)}>
                    <Text style={styles.deleteButtonText}>Remove</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>

    );
};

export default UserListItem;

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: "row"
    },
    item: {
        flex: 1,
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc"
    },
    nameText: {
        fontSize: 24,
        color: "#555",

    },
    deleteButton: {
        width: 100,
        height: "100%",
        backgroundColor: COLORS.mainRed,
        justifyContent: 'center',
        alignItems: "center",
        position: "absolute",
        right: -100,

    },
    deleteButtonText: {
        color: "#fff",
        fontWeight: "bold"
    },
    suspendButton: {
        width: 100,
        height: "100%",
        backgroundColor: COLORS.mainOrange,
        justifyContent: 'center',
        alignItems: "center",
        position: "absolute",
        left: -100,
    },
    returnButton: {
        width: 100,
        height: "100%",
        backgroundColor: COLORS.greenSubmit,
        justifyContent: 'center',
        alignItems: "center",
        position: "absolute",
        left: -100,
    },
    suspendButtonText: {
        color: "#fff",
        fontWeight: "bold"
    }

});
