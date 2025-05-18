import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

// Icon types supported
type IconType = 'none' | 'check' | 'bell';

// Props interface
interface CustomButtonProps {
  label: string;
  color: string;
  icon?: IconType;
  onPress?: () => void;
  width?: number;
  height?: number;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  color,
  icon = 'none',
  onPress,
  width = 180,
  height = 60,
}) => {
  // Get button colors based on selected color
  const getColors = () => {
    switch (color) {
      case 'purple':
        return {
          main: '#8A4FD0',
          shadow: '#6B3DA5',
        };
      case 'teal':
        return {
          main: '#5ECBC9',
          shadow: '#42A3A1',
        };
      case 'green':
        return {
          main: '#2ECC71',
          shadow: '#27AE60',
        };
      case 'red':
        return {
          main: '#F93D66',
          shadow: '#D02E52',
        };
      default:
        return {
          main: '#8A4FD0',
          shadow: '#6B3DA5',
        };
    }
  };

  const colors = getColors();

  // Get icon component based on selected icon type
  const renderIcon = () => {
    if (icon === 'check') {
      return (
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>\u2713</Text>
        </View>
      );
    } else if (icon === 'bell') {
      return (
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>\U0001f514</Text>
        </View>
      );
    }
    return null;
  };

  // Dynamic container styles
  const containerStyle: ViewStyle = {
    width,
    height,
    backgroundColor: colors.main,
    borderBottomColor: colors.shadow,
    borderBottomWidth: height * 0.2, // 20% of height for 3D effect
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.buttonContainer, containerStyle]}
    >
      <View style={styles.buttonContent}>
        {renderIcon()}
        <Text style={styles.buttonText}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8, // Offset to center vertically with the shadow
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textTransform: 'uppercase',
  },
  iconContainer: {
    marginRight: 8,
  },
  iconText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CustomButton;