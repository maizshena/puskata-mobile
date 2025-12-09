// components/ui/Button.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { Colors } from '@/constants/Colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
      paddingHorizontal: size === 'sm' ? 16 : size === 'lg' ? 24 : 20,
      paddingVertical: size === 'sm' ? 10 : size === 'lg' ? 16 : 14,
    };

    if (disabled || loading) {
      return { ...baseStyle, backgroundColor: Colors.gray300 };
    }

    switch (variant) {
      case 'primary':
        return { ...baseStyle, backgroundColor: Colors.primary };
      case 'secondary':
        return { ...baseStyle, backgroundColor: Colors.gray100 };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: Colors.primary,
        };
      case 'ghost':
        return { ...baseStyle, backgroundColor: 'transparent' };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: size === 'sm' ? 14 : size === 'lg' ? 18 : 16,
      fontWeight: '600',
    };

    if (disabled || loading) {
      return { ...baseStyle, color: Colors.gray500 };
    }

    switch (variant) {
      case 'primary':
        return { ...baseStyle, color: Colors.white };
      case 'secondary':
        return { ...baseStyle, color: Colors.gray700 };
      case 'outline':
        return { ...baseStyle, color: Colors.primary };
      case 'ghost':
        return { ...baseStyle, color: Colors.gray700 };
      default:
        return baseStyle;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[getButtonStyle(), style]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? Colors.white : Colors.primary}
        />
      ) : (
        <>
          {leftIcon && <View style={{ marginRight: 8 }}>{leftIcon}</View>}
          <Text style={getTextStyle()}>{title}</Text>
          {rightIcon && <View style={{ marginLeft: 8 }}>{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
};