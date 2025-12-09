// app/(tabs)/bookshelf.tsx
import { BookCard } from '@/components/BookCard';
import { LoanCard } from '@/components/LoanCard';
import { Loading } from '@/components/ui/Loading';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import { loanService } from '@/services/loan.service';
import { wishlistService } from '@/services/wishlist.service';
import { Loan, Wishlist } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type TabType = 'borrowed' | 'returned' | 'saved';

export default function BookshelfScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('borrowed');
  const [loans, setLoans] = useState<Loan[]>([]);
  const [wishlist, setWishlist] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
    if (user) {
        loadData();
    } else {
        setLoading(false); // TAMBAHKAN INI - fix loading forever
    }
    }, [user]); // TAMBAHKAN dependency user

    const loadData = async () => {
    if (!user) {
        setLoading(false); // TAMBAHKAN INI
        return;
    }

    try {
        const [loansResponse, wishlistResponse] = await Promise.all([
        loanService.getUserLoans(user.id),
        wishlistService.getUserWishlist(user.id),
        ]);

        if (loansResponse.success && loansResponse.data) {
        setLoans(loansResponse.data);
        }

        if (wishlistResponse.success && wishlistResponse.data) {
        setWishlist(wishlistResponse.data);
        }
    } catch (error) {
        console.error('Error loading bookshelf data:', error);
    } finally {
        setLoading(false);
        setRefreshing(false);
    }
    };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleReturnBook = async (loanId: number) => {
    Alert.alert('Return Book', 'Are you sure you want to return this book?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Return',
        style: 'default',
        onPress: async () => {
          try {
            const response = await loanService.returnBook(loanId);
            if (response.success) {
              Alert.alert('Success', 'Book returned successfully');
              loadData();
            }
          } catch (error) {
            Alert.alert('Error', 'Failed to return book');
          }
        },
      },
    ]);
  };

  const handleRemoveFromWishlist = async (wishlistId: number) => {
    try {
      const response = await wishlistService.removeFromWishlist(wishlistId);
      if (response.success) {
        setWishlist(wishlist.filter((item) => item.id !== wishlistId));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to remove from wishlist');
    }
  };

  const borrowedLoans = loans.filter(
    (loan) => loan.status === 'approved' || loan.status === 'pending'
  );
  const returnedLoans = loans.filter((loan) => loan.status === 'returned');

  const renderTabButton = (
    tab: TabType,
    iconName: string,
    label: string,
    count: number
  ) => (
    <TouchableOpacity
      onPress={() => setActiveTab(tab)}
      style={[styles.tab, activeTab === tab && styles.activeTab]}
    >
      <Ionicons
        name={iconName as any}
        size={18}
        color={activeTab === tab ? Colors.primary : Colors.gray400}
      />
      <Text
        style={[
          styles.tabText,
          activeTab === tab ? styles.activeTabText : styles.inactiveTabText,
        ]}
      >
        {label} ({count})
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
        
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Bookshelf</Text>
          <Text style={styles.subtitle}>Manage your borrowed and saved books</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {renderTabButton('borrowed', 'book-outline', 'Borrowed', borrowedLoans.length)}
          {renderTabButton('returned', 'refresh-outline', 'Returned', returnedLoans.length)}
          {renderTabButton('saved', 'bookmark-outline', 'Saved', wishlist.length)}
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
            />
          }
        >
          <View style={styles.listContainer}>
            {activeTab === 'borrowed' && (
              <>
                {borrowedLoans.length > 0 ? (
                  borrowedLoans.map((loan) => (
                    <LoanCard
                      key={loan.id}
                      loan={loan}
                      onReturn={handleReturnBook}
                      showActions
                    />
                  ))
                ) : (
                  <View style={styles.emptyState}>
                    <Ionicons name="book-outline" size={64} color={Colors.gray300} />
                    <Text style={styles.emptyTitle}>No borrowed books</Text>
                    <Text style={styles.emptySubtitle}>
                      Start exploring and borrow some books
                    </Text>
                  </View>
                )}
              </>
            )}

            {activeTab === 'returned' && (
              <>
                {returnedLoans.length > 0 ? (
                  returnedLoans.map((loan) => (
                    <LoanCard key={loan.id} loan={loan} showActions={false} />
                  ))
                ) : (
                  <View style={styles.emptyState}>
                    <Ionicons name="refresh-outline" size={64} color={Colors.gray300} />
                    <Text style={styles.emptyTitle}>No returned books yet</Text>
                  </View>
                )}
              </>
            )}

            {activeTab === 'saved' && (
              <>
                {wishlist.length > 0 ? (
                  wishlist.map((item) =>
                    item.book ? (
                      <View key={item.id} style={styles.wishlistItem}>
                        <BookCard
                          book={item.book}
                          variant="horizontal"
                          onPress={() => router.push(`/book/${item.book_id}`)}
                        />
                        <TouchableOpacity
                          onPress={() => handleRemoveFromWishlist(item.id)}
                          style={styles.removeButton}
                        >
                          <Ionicons name="bookmark" size={20} color={Colors.error} />
                        </TouchableOpacity>
                      </View>
                    ) : null
                  )
                ) : (
                  <View style={styles.emptyState}>
                    <Ionicons name="bookmark-outline" size={64} color={Colors.gray300} />
                    <Text style={styles.emptyTitle}>No saved books</Text>
                    <Text style={styles.emptySubtitle}>
                      Save books to read them later
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.gray900,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.gray600,
    marginTop: 4,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: Colors.primary,
  },
  inactiveTabText: {
    color: Colors.gray500,
  },
  scrollView: {
    flex: 1,
  },
  listContainer: {
    padding: 24,
  },
  wishlistItem: {
    position: 'relative',
    marginBottom: 12,
  },
  removeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#fee2e2',
    padding: 8,
    borderRadius: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray500,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.gray400,
    marginTop: 8,
    textAlign: 'center',
  },
});