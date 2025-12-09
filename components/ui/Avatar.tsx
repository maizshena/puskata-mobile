// components/ui/Avatar.tsx
import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface AvatarProps {
  source?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 'md',
}) => {
  const sizeValues = {
    sm: 32,
    md: 40,
    lg: 56,
    xl: 80,
  };

  const fontSizes = {
    sm: 14,
    md: 16,
    lg: 20,
    xl: 28,
  };

  const dimension = sizeValues[size];
  const fontSize = fontSizes[size];

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
        },
      ]}
    >
      {source ? (
        <Image
          source={{ uri: source }}
          style={{
            width: dimension,
            height: dimension,
            borderRadius: dimension / 2,
          }}
        />
      ) : (
        <Text style={[styles.initials, { fontSize }]}>
          {getInitials(name)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  initials: {
    fontWeight: '600',
    color: Colors.primary,
  },
});