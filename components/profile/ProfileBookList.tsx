/* eslint-disable @typescript-eslint/no-unused-vars */
import { supabase } from '@/app/lib/supabase';
import BookItem from '@/components/book/BookItem';
import AppText from '@/components/common/AppText';
import { Book } from '@/types/book';
import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, FlatList, View, TouchableOpacity } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { MoreHorizontal } from 'lucide-react-native';

type ProfileBookListProps = {
  userId: string;
  shelfId: string; // Changed from number to string to match UUID
  title?: string;
};

export default function ProfileBookList({ userId, shelfId, title }: ProfileBookListProps) {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      async function fetchBooks() {
        setLoading(true);
        setError(null);

        // Fetch from shelfBooks, join with books
        const { data, error: fetchError } = await supabase
          .from('shelfBooks')
          .select('*, books(*)')
          // Note: shelfBooks only stores the shelf_id and book_isbn,
          // and user_id is implicit via the shelf, but we already filter by shelf_id.
          .eq('shelf_id', shelfId)
          .order('position', { ascending: true, nullsFirst: false });

        if (fetchError) {
          if (mounted) setError(fetchError.message);
        } else if (data) {
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
        {title && <AppText variant="subtitle" className="mb-3">{title}</AppText>}
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="mb-6 px-4">
        {title && <AppText variant="subtitle" className="mb-3">{title}</AppText>}
        <AppText variant="label" className="text-red-500">Error loading books: {error}</AppText>
      </View>
    );
  }

  if (books.length === 0) {
    return null;
  }

  return (
    <View className="mb-2">
      {title && (
        <View className="px-4 mb-3 flex-row items-center justify-between">
          <AppText variant="subtitle">{title}</AppText>
          <TouchableOpacity
            onPress={() => router.push(`/shelf/${shelfId}/edit` as any)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MoreHorizontal size={24} color="#64748b" />
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={books}
        keyExtractor={(item, index) => item.isbn || index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16, gap: 16 }}
        renderItem={({ item }) => (
          <BookItem book={item} className="w-24 h-36" />
        )}
      />
      <View className="h-[1px] bg-[#d1d5db] mx-4 mt-2 mb-1" />
    </View>
  );
}