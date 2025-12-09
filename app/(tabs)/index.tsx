// app/(tabs)/index.tsx
import { BookCard } from '@/components/BookCard';
import { SectionHeader } from '@/components/SectionHeader';
import { Avatar } from '@/components/ui/Avatar';
import { Loading } from '@/components/ui/Loading';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import { bookService } from '@/services/book.service';
import { Book } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);
  const [popularBooks, setPopularBooks] = useState<Book[]>([]);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await bookService.getBooks();
      if (response.success && response.data) {
        setRecentBooks(response.data.slice(0, 5));
        setPopularBooks(response.data.slice(0, 3));
        setRecommendedBooks(response.data.slice(2, 7));
      }
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const navigateToBook = (bookId: number) => {
    router.push(`/book/${bookId}`);
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 90 }} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.userInfo}>
              <Avatar source={user?.profile_image} name={user?.name} size="md" />
              <View style={styles.greeting}>
                <Text style={styles.welcomeText}>Welcome back,</Text>
                <Text style={styles.userName}>{user?.name}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color={Colors.gray700} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/explore')}
            style={styles.searchBar}
          >
            <Ionicons name="search-outline" size={20} color={Colors.gray400} />
            <Text style={styles.searchPlaceholder}>Search books, authors...</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Books */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderContainer}>
            <SectionHeader
              title="Recently Added"
              subtitle="Fresh arrivals in our library"
              onSeeAll={() => router.push('/(tabs)/explore')}
            />
          </View>
          <FlatList
            horizontal
            data={recentBooks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <BookCard
                book={item}
                variant="vertical"
                onPress={() => navigateToBook(item.id)}
              />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Popular Books */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderContainer}>
            <SectionHeader
              title="Popular Now"
              subtitle="Most borrowed books this month"
              onSeeAll={() => router.push('/(tabs)/explore')}
            />
          </View>
          {popularBooks.map((book) => (
            <View key={book.id} style={styles.bookItem}>
              <BookCard
                book={book}
                variant="horizontal"
                onPress={() => navigateToBook(book.id)}
              />
            </View>
          ))}
        </View>

        {/* Recommended */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderContainer}>
            <SectionHeader
              title="Recommended for You"
              subtitle="Based on your reading history"
              onSeeAll={() => router.push('/(tabs)/explore')}
            />
          </View>
          <FlatList
            horizontal
            data={recommendedBooks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <BookCard
                book={item}
                variant="vertical"
                onPress={() => navigateToBook(item.id)}
              />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: Colors.white,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    marginLeft: 12,
  },
  welcomeText: {
    fontSize: 14,
    color: Colors.gray600,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.gray900,
  },
  notificationButton: {
    backgroundColor: Colors.gray100,
    padding: 12,
    borderRadius: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  searchPlaceholder: {
    marginLeft: 12,
    fontSize: 15,
    color: Colors.gray500,
  },
  section: {
    marginTop: 24,
  },
  sectionHeaderContainer: {
    paddingHorizontal: 24,
  },
  horizontalList: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  bookItem: {
    paddingHorizontal: 24,
    marginBottom: 8,
  },
});