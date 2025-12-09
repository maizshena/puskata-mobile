// app/book/[id].tsx
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import { bookService } from '@/services/book.service';
import { loanService } from '@/services/loan.service';
import { wishlistService } from '@/services/wishlist.service';
import { Book } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    loadBookDetail();
    checkWishlistStatus();
  }, [id]);

  const loadBookDetail = async () => {
    try {
      const response = await bookService.getBookById(Number(id));
      if (response.success && response.data) {
        setBook(response.data);
      }
    } catch (error) {
      console.error('Error loading book:', error);
      Alert.alert('Error', 'Failed to load book details');
    } finally {
      setLoading(false);
    }
  };

  const checkWishlistStatus = async () => {
    if (!user) return;
    try {
      const inWishlist = await wishlistService.checkInWishlist(user.id, Number(id));
      setIsInWishlist(inWishlist);
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const handleBorrowBook = async () => {
    if (!user || !book) return;

    if (book.available === 0) {
      Alert.alert('Unavailable', 'This book is currently not available');
      return;
    }

    Alert.alert('Borrow Book', `Do you want to borrow "${book.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Borrow',
        onPress: async () => {
          setBorrowing(true);
          try {
            const response = await loanService.borrowBook(user.id, book.id);
            if (response.success) {
              Alert.alert(
                'Success',
                'Borrow request submitted successfully. Please wait for admin approval.',
                [{ text: 'OK', onPress: () => router.back() }]
              );
            }
          } catch (error) {
            Alert.alert('Error', 'Failed to borrow book');
          } finally {
            setBorrowing(false);
          }
        },
      },
    ]);
  };

  const handleToggleWishlist = async () => {
    if (!user || !book) return;

    try {
      if (isInWishlist) {
        const wishlistResponse = await wishlistService.getUserWishlist(user.id);
        if (wishlistResponse.success && wishlistResponse.data) {
          const item = wishlistResponse.data.find((w) => w.book_id === book.id);
          if (item) {
            await wishlistService.removeFromWishlist(item.id);
            setIsInWishlist(false);
            Alert.alert('Removed', 'Book removed from wishlist');
          }
        }
      } else {
        await wishlistService.addToWishlist(user.id, book.id);
        setIsInWishlist(true);
        Alert.alert('Added', 'Book added to wishlist');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update wishlist');
    }
  };

  const InfoItem = ({
    icon,
    label,
    value,
  }: {
    icon: string;
    label: string;
    value: string;
  }) => (
    <View style={styles.infoItem}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon as any} size={16} color={Colors.primary} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!book) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Book not found</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
            <Ionicons name="close" size={24} color={Colors.gray700} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleToggleWishlist} style={styles.headerButton}>
            <Ionicons
              name={isInWishlist ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={isInWishlist ? Colors.primary : Colors.gray700}
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Book Cover */}
          <View style={styles.coverContainer}>
            <Image
              source={{
                uri: book.cover_image || 'https://via.placeholder.com/300',
              }}
              style={styles.cover}
            />
          </View>

          {/* Book Info */}
          <View style={styles.infoContainer}>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={styles.bookAuthor}>{book.author}</Text>

            {/* Availability Badge */}
            <View style={styles.badges}>
              <View
                style={[
                  styles.availabilityBadge,
                  book.available > 0 ? styles.availableBadge : styles.unavailableBadge,
                ]}
              >
                <Text
                  style={[
                    styles.availabilityText,
                    book.available > 0
                      ? styles.availableText
                      : styles.unavailableText,
                  ]}
                >
                  {book.available > 0 ? `${book.available} Available` : 'Not Available'}
                </Text>
              </View>
              {book.category && (
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{book.category}</Text>
                </View>
              )}
            </View>

            {/* Description */}
            {book.description && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{book.description}</Text>
              </View>
            )}

            {/* Book Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Book Details</Text>

              {book.isbn && (
                <InfoItem icon="pricetag-outline" label="ISBN" value={book.isbn} />
              )}

              <InfoItem icon="person-outline" label="Author" value={book.author} />

              {book.publisher && (
                <InfoItem
                  icon="business-outline"
                  label="Publisher"
                  value={book.publisher}
                />
              )}

              {book.published_year && (
                <InfoItem
                  icon="calendar-outline"
                  label="Published Year"
                  value={book.published_year.toString()}
                />
              )}

              {book.pages && (
                <InfoItem
                  icon="document-text-outline"
                  label="Pages"
                  value={`${book.pages} pages`}
                />
              )}

              {book.language && (
                <InfoItem icon="globe-outline" label="Language" value={book.language} />
              )}

              <InfoItem
                icon="book-outline"
                label="Total Copies"
                value={`${book.available} / ${book.quantity}`}
              />
            </View>
          </View>
        </ScrollView>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <Button
            title={book.available > 0 ? 'Borrow Book' : 'Not Available'}
            onPress={handleBorrowBook}
            loading={borrowing}
            disabled={book.available === 0}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerButton: {
    backgroundColor: Colors.gray100,
    padding: 8,
    borderRadius: 8,
  },
  scrollView: {
    flex: 1,
  },
  coverContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  cover: {
    width: 192,
    height: 288,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  infoContainer: {
    paddingHorizontal: 24,
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.gray900,
    marginBottom: 8,
  },
  bookAuthor: {
    fontSize: 18,
    color: Colors.gray600,
    marginBottom: 16,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  availabilityBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  availableBadge: {
    backgroundColor: '#d1fae5',
  },
  unavailableBadge: {
    backgroundColor: '#fee2e2',
  },
  availabilityText: {
    fontSize: 14,
    fontWeight: '600',
  },
  availableText: {
    color: '#065f46',
  },
  unavailableText: {
    color: '#991b1b',
  },
  categoryBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.gray900,
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: Colors.gray700,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    backgroundColor: Colors.gray100,
    padding: 8,
    borderRadius: 8,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.gray500,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.gray900,
    marginTop: 2,
  },
  bottomActions: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: Colors.gray500,
    marginBottom: 24,
  },
});