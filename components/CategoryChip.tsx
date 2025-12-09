// components/CategoryChip.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface CategoryChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  label,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        isSelected ? styles.selected : styles.unselected,
      ]}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.text,
          isSelected ? styles.textSelected : styles.textUnselected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  selected: {
    backgroundColor: Colors.primary,
  },
  unselected: {
    backgroundColor: Colors.gray100,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
  textSelected: {
    color: Colors.white,
  },
  textUnselected: {
    color: Colors.gray700,
  },
});