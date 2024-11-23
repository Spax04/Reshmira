import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { COLORS, COMMON } from '../../constants';

const CButton = ({ onPress, content, type, isPressed,icon }) => {
  const [btnColor, setBtnColor] = useState('');
  const [btnTextColor, setBtnTextColor] = useState('');

  useEffect(() => {
    // Set button color and corresponding text color
    switch (type) {
      case COMMON.BTN_TYPES.SUCCEED:
        setBtnColor(COLORS.greenSubmit);
        setBtnTextColor(COLORS.whiteText);
        break;
      case COMMON.BTN_TYPES.WARNING:
        setBtnColor(COLORS.mainOrange);
        setBtnTextColor(COLORS.whiteText);
        break;
      case COMMON.BTN_TYPES.INFO:
        setBtnColor(COLORS.mainBlue);
        setBtnTextColor(COLORS.whiteText);
        break;
      case COMMON.BTN_TYPES.DANGER:
        setBtnColor(COLORS.mainRed);
        setBtnTextColor(COLORS.whiteText);
        break;
      default:
        setBtnColor(COLORS.neutralCustom);
        setBtnTextColor(COLORS.mainDark);
        break;
    }
  }, [type]);

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        { backgroundColor: btnColor },
        isPressed && styles.btnPressed, // Apply pressed styles
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.btnText,
          { color: btnTextColor },
          isPressed && styles.btnTextPressed, // Apply pressed text styles
        ]}
      >
        {icon}{content}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    margin: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5, // Rounded corners
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000', // Shadow for depth
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Shadow for Android
  },
  btnPressed: {
    backgroundColor: '#cccccc', // Lighter color for the pressed state
    elevation: 2, // Reduce elevation for a "pressed" look
    transform: [{ scale: 0.90 }], // Slightly shrink the button
  },
  btnText: {
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  btnTextPressed: {
    color: '#666666', // Slightly darker text when pressed
  },
});

export default CButton;
