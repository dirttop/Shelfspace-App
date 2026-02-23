import AppText from '@/components/common/AppText';
import Input from '@/components/common/Input';
import { useBookSearch } from '@/hooks/useBookSearch';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, TouchableOpacity, View } from 'react-native';

export default function SearchTab() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { books, loading: isLoading, error } = useBookSearch(debouncedQuery);

  return (
    <View className="flex-1 bg-white">
      <View className="px-4 pt-4 pb-1 border-b border-zinc-200">
        <Input
          placeholder="Search by title, author, or ISBN..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {isLoading && <ActivityIndicator className="mt-5" size="large" />}
      {error && <AppText className="text-maroon-500 text-center mt-4">Error loading books.</AppText>}

      <FlatList
        data={books}
        keyExtractor={(item, index) => item.isbn ? item.isbn : `${item.title}-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity 
             className="p-4 border-b border-zinc-200"
             onPress={() => router.push(`/books/${item.isbn || encodeURIComponent(item.title)}` as any)} // Route to details
          >
            <AppText variant="body" className="font-semibold text-lg">{item.title}</AppText>
            <AppText variant="caption" className="text-zinc-500">{item.authors?.join(', ') || 'Unknown Author'}</AppText>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          !isLoading && debouncedQuery ? (
            <AppText className="text-center mt-5 text-zinc-500">No books found.</AppText>
          ) : null
        )}
      />
    </View>
  );
};