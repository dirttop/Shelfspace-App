import BookItem from '@/components/book/BookItem';
import AppText from '@/components/common/AppText';
import Input from '@/components/common/Input';
import { useBookSearch } from '@/hooks/useBookSearch';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { 
  ActivityIndicator, 
  FlatList, 
  TouchableOpacity, 
  View, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import {
  SafeAreaView,
  SafeAreaProvider,
  SafeAreaInsetsContext,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';


export default function SearchTab() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { books, loading: isLoading, error } = useBookSearch(debouncedQuery);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 pt-4 pb-1 border-b border-zinc-200">
        <Input
          placeholder="Search by title, author, or ISBN..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {isLoading && <ActivityIndicator className="mt-5" size="large" />}
      {error && <AppText className="text-maroon-500 text-center mt-4">Error loading books.</AppText>}
      <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              className="flex-1"
              keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <FlatList
          data={books}
          keyExtractor={(item, index) => item.isbn ? item.isbn : `${item.title}-${index}`}
          renderItem={({ item }) => (
            <BookItem book={item} className="w-24 h-36"/>
          )}
          ListEmptyComponent={() => (
            !isLoading && debouncedQuery ? (
              <AppText className="text-center mt-5 text-zinc-500">No books found.</AppText>
            ) : null
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};