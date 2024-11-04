import React from 'react';
import { StyleSheet, View, Button, SafeAreaView } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

const AccordionItem = ({
    isExpanded,
    children,
    viewKey,
    style,
    duration = 500,
}) => {

    const height = useSharedValue(0);

    const derivedHeight = useDerivedValue(() =>
        withTiming(height.value * Number(isExpanded.value), {
            duration,
        })
    );
    const bodyStyle = useAnimatedStyle(() => ({
        height: derivedHeight.value,
    }));

    return (
        <Animated.View
            key={`accordionItem_${viewKey}`}
            style={[styles.animatedView, bodyStyle, style]}>
            <View
                onLayout={(e) => {
                    height.value = e.nativeEvent.layout.height;
                }}
                style={styles.wrapper}>
                {children}
            </View>
        </Animated.View>
    )
}

export default AccordionItem

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
    }, animatedView: {
        width: '100%',
        overflow: 'hidden',
    },
})