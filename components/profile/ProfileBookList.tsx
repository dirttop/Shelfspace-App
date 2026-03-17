import { supabase } from '@/app/lib/supabase';
import BookItem from '@/components/book/BookItem';
import AppText from '@/components/common/AppText';
import { Book } from '@/types/book';
import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { useFocusEffect } from 'expo-router';

type ProfileBookListProps = {
  userId: string;
  shelfId: string; // Changed from number to string to match UUID
  title?: string;
};

export default function ProfileBookList({ userId, shelfId, title }: ProfileBookListProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
    let mounted = true;

    async function fetchBooks() {
      setLoading(true);
      setError(null);

      // Fetch from shelf_books, join with books
      const { data, error: fetchError } = await supabase
        .from('shelf_books')
        .select('*, books(*)')
        // Note: shelf_books only stores the shelf_id and book_isbn,
        // and user_id is implicit via the shelf, but we already filter by shelf_id.
        .eq('shelf_id', shelfId);

      if (fetchError) {
        console.error("ProfileBookList fetch error:", fetchError);
        if (mounted) setError(fetchError.message);
      } else if (data) {
        console.log("ProfileBookList fetched data:", data);
        const mappedBooks = data.map((item: any) => {
           const bookData = item.books || item.book;
           if (!bookData) return null;
           
           return {
             ...bookData,
             coverImage: bookData.cover_image,
             pageCount: bookData.page_count,
             releaseYear: bookData.release_year,
           } as Book;
        }).filter((book): book is Book => book !== null);
        
        if (mounted) setBooks(mappedBooks);
      }

      if (mounted) setLoading(false);
    }

    if (userId) {
      fetchBooks();
    }

    return () => {
      mounted = false;
    };
  }, [userId, shelfId])
  );

  if (loading) {
    return (
      <View className="mb-6 px-4">
        {title && <AppText variant="subtitle" className="mb-3 font-semibold">{title}</AppText>}
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="mb-6 px-4">
        {title && <AppText variant="subtitle" className="mb-3 font-semibold">{title}</AppText>}
        <AppText className="text-red-500 text-sm">Error loading books: {error}</AppText>
      </View>
    );
  }

  if (books.length === 0) {
      return null;
  }

  return (
    <View className="mb-6">
      {title && (
        <View className="px-4 mb-3">
          <AppText variant="subtitle" className="font-semibold">{title}</AppText>
        </View>
      )}
      <FlatList
        data={books}
        keyExtractor={(item, index) => item.isbn || index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
        renderItem={({ item }) => (
          <BookItem book={item} className="w-24 h-36" />
        )}
      />
    </View>
  );
}
