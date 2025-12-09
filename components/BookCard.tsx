// components/BookCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Book } from '@/types';
import { Colors } from '@/constants/Colors';

interface BookCardProps {
  book: Book;
  onPress?: () => void;
  variant?: 'vertical' | 'horizontal';
  showAvailability?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onPress,
  variant = 'vertical',
  showAvailability = true,
}) => {
  if (variant === 'horizontal') {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={styles.horizontalContainer}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: book.cover_image || 'https://via.placeholder.com/100' }}
          style={styles.horizontalImage}
        />
        <View style={styles.horizontalContent}>
          <Text style={styles.horizontalTitle} numberOfLines={2}>
            {book.title}
          </Text>
          <Text style={styles.horizontalAuthor} numberOfLines={1}>
            {book.author}
          </Text>
          {book.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{book.category}</Text>
            </View>
          )}
          {showAvailability && (
            <View style={styles.availabilityContainer}>
              <Ionicons name="book-outline" size={14} color={Colors.primary} />
              <Text style={styles.availabilityText}>
                {book.available} / {book.quantity} available
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.verticalContainer}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: book.cover_image || 'https://via.placeholder.com/150' }}
        style={styles.verticalImage}
      />
      <View style={styles.verticalContent}>
        <Text style={styles.verticalTitle} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={styles.verticalAuthor} numberOfLines={1}>
          {book.author}
        </Text>
        {showAvailability && (
          <View style={styles.availabilityContainer}>
            <Ionicons name="book-outline" size={12} color={Colors.primary} />
            <Text style={[styles.availabilityText, { fontSize: 12 }]}>
              {book.available} left
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Horizontal variant
  horizontalContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.gray100,
  },
  horizontalImage: {
    width: 80,
    height: 112,
    borderRadius: 8,
  },
  horizontalContent: {
    flex: 1,
    marginLeft: 16,
  },
  horizontalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray900,
    marginBottom: 4,
  },
  horizontalAuthor: {
    fontSize: 14,
    color: Colors.gray600,
    marginBottom: 8,
  },

  // Vertical variant
  verticalContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginRight: 16,
    width: 144,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.gray100,
    overflow: 'hidden',
  },
  verticalImage: {
    width: '100%',
    height: 192,
  },
  verticalContent: {
    padding: 12,
  },
  verticalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray900,
    marginBottom: 4,
  },
  verticalAuthor: {
    fontSize: 12,
    color: Colors.gray600,
    marginBottom: 8,
  },

  // Common
  categoryBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  availabilityText: {
    fontSize: 12,
    color: Colors.gray600,
    marginLeft: 4,
  },
});