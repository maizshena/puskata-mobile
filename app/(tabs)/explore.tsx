// app/(tabs)/explore.tsx - FULL REPLACEMENT
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BookCard } from '@/components/BookCard';
import { CategoryChip } from '@/components/CategoryChip';
import { SectionHeader } from '@/components/SectionHeader';
import { Loading } from '@/components/ui/Loading';
import { bookService } from '@/services/book.service';
import { Book } from '@/types';
import { CATEGORIES } from '@/constants/MockData';
import { Colors } from '@/constants/Colors';

export default function ExploreScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [popularBooks, setPopularBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [searchQuery, selectedCategory, books]);

  const loadBooks = async () => {
    try {
      const response = await bookService.getBooks();
      if (response.success && response.data) {
        setBooks(response.data);
        setPopularBooks(response.data.slice(0, 3));
      }
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = () => {
    let filtered = books;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((book) => book.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBooks(filtered);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const navigateToBook = (bookId: number) => {
    router.push(`/book/${bookId}`);
  };

  if (loading && books.length === 0) {
    return <Loading fullScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* SCROLLVIEW SEKARANG WRAP SEMUANYA TERMASUK HEADER */}
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={{ paddingBottom: 90 }} // TAMBAHKAN paddingBottom
        showsVerticalScrollIndicator={false}
      >
        {/* Header - SEKARANG DI DALAM SCROLLVIEW */}
        <View style={styles.header}>
          <Text style={styles.title}>Explore Books</Text>

          {/* Search Bar */}
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color={Colors.gray400} />
            <TextInput
              placeholder="Search books, authors..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
              placeholderTextColor={Colors.gray400}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch}>
                <Ionicons name="close-circle" size={20} color={Colors.gray400} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categories}
          >
            {CATEGORIES.map((category) => (
              <CategoryChip
                key={category}
                label={category}
                isSelected={selectedCategory === category}
                onPress={() => setSelectedCategory(category)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Popular Today */}
        {!searchQuery && (
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="trending-up" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Popular Today</Text>
            </View>
            <FlatList
              horizontal
              data={popularBooks}
              keyExtractor={(item) => `popular-${item.id}`}
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
        )}

        {/* Today's Pick */}
        {!searchQuery && books.length > 0 && (
          <View style={styles.todaysPick}>
            <View style={styles.todaysPickHeader}>
              <Ionicons name="star" size={20} color={Colors.white} />
              <Text style={styles.todaysPickTitle}>Today's Pick</Text>
            </View>
            <Text style={styles.todaysPickSubtitle}>
              Hand-picked recommendation just for you
            </Text>
            <View style={styles.todaysPickBook}>
              <BookCard
                book={books[0]}
                variant="horizontal"
                onPress={() => navigateToBook(books[0].id)}
              />
            </View>
          </View>
        )}

        {/* Weekly Recommend */}
        {!searchQuery && (
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Weekly Recommend</Text>
            </View>
            {books.slice(1, 4).map((book) => (
              <View key={`weekly-${book.id}`} style={styles.bookItem}>
                <BookCard
                  book={book}
                  variant="horizontal"
                  onPress={() => navigateToBook(book.id)}
                />
              </View>
            ))}
          </View>
        )}

        {/* All Books / Search Results */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderContainer}>
            <SectionHeader
              title={searchQuery ? 'Search Results' : 'All Books'}
              subtitle={`${filteredBooks.length} books available`}
              showSeeAll={false}
            />
          </View>
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <View key={`all-${book.id}`} style={styles.bookItem}>
                <BookCard
                  book={book}
                  variant="horizontal"
                  onPress={() => navigateToBook(book.id)}
                />
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="book-outline" size={48} color={Colors.gray300} />
              <Text style={styles.emptyText}>No books found</Text>
            </View>
          )}
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
    paddingBottom: 16,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.gray900,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: Colors.gray900,
  },
  categoriesContainer: {
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  categories: {
    paddingHorizontal: 24,
  },
  section: {
    marginTop: 24,
    marginBottom: 16, // TAMBAHKAN spacing
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.gray900,
    marginLeft: 8,
  },
  sectionHeaderContainer: {
    paddingHorizontal: 24,
  },
  horizontalList: {
    paddingHorizontal: 24,
    paddingBottom: 8, // TAMBAHKAN spacing
  },
  todaysPick: {
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 16, // TAMBAHKAN spacing
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 24,
  },
  todaysPickHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  todaysPickTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
    marginLeft: 8,
  },
  todaysPickSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
  },
  todaysPickBook: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bookItem: {
    paddingHorizontal: 24,
    marginBottom: 8, // TAMBAHKAN spacing
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray500,
    marginTop: 16,
  },
});