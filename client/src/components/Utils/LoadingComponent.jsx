import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const LoadingComponent = ({ isLoading }) => {
    if (!isLoading) {
        return null; 
    }

    return (
        <View style={styles.overlay}>
            <View style={styles.loadingContainer}>
                <Image
                    source={require('../../../assets/loading.gif')} 
                    style={styles.loadingImage}
                />
                <Text style={styles.loadingText}>טוען, נא המתן רגע...</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: 3
    },
    loadingContainer: {
        flexDirection:"row",
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        elevation: 5, 
    },
    loadingImage: {
        width: 80,
        height: 80,
    },
    loadingText: {
        paddingRight:30,
        fontSize: 16,
        fontWeight:"bold",
        color: '#333',
    },
});

export default LoadingComponent;
