import BookItem from '@/components/book/BookItem';
import AppText from '@/components/common/AppText';
import Input from '@/components/common/Input';
import { useBookSearch } from '@/hooks/useBookSearch';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  View,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const BooksTab = ({ searchQuery }: { searchQuery: string }) => {
  const { books, loading: isLoading, error } = useBookSearch(searchQuery);

  return (
    <View className="flex-1 bg-white">
      {isLoading && <ActivityIndicator className="mt-5" size="large" />}
      {error && <AppText className="text-maroon-500 text-center mt-4">Error loading books.</AppText>}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <FlatList
          data={books}
          keyboardShouldPersistTaps="handled"
          keyExtractor={(item, index) => item.isbn ? item.isbn : `${item.title}-${index}`}
          numColumns={3}
          contentContainerStyle={{ padding: 16 }}
          columnWrapperStyle={{ justifyContent: 'flex-start', marginBottom: 16, gap: 16 }}
          renderItem={({ item }) => (
            <BookItem book={item} />
          )}
          ListEmptyComponent={() => (
            !isLoading && searchQuery ? (
              <AppText className="text-center mt-5 text-zinc-500">No books found.</AppText>
            ) : null
          )}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

const UsersTab = () => (
  <View className="flex-1 bg-white justify-center items-center">
    <AppText className="text-zinc-500">Users search coming soon.</AppText>
  </View>
);

const ClubsTab = () => (
  <View className="flex-1 bg-white justify-center items-center">
    <AppText className="text-zinc-500">Clubs search coming soon.</AppText>
  </View>
);

export default function SearchTab() {
  const router = useRouter();
  const { q } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState((q as string) || '');
  const [debouncedQuery, setDebouncedQuery] = useState((q as string) || '');

  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'books', title: 'Books' },
    { key: 'users', title: 'Users' },
    { key: 'clubs', title: 'Clubs' },
  ]);

  useEffect(() => {
    if (q) {
      setSearchQuery(q as string);
    }
  }, [q]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case 'books':
        return <BooksTab searchQuery={debouncedQuery} />;
      case 'users':
        return <UsersTab />;
      case 'clubs':
        return <ClubsTab />;
      default:
        return null;
    }
  };

  const renderTabBar = (props: any) => (
    <View className="bg-white">
      <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: '#27272a' }} // zinc-800
        style={{ backgroundColor: 'white', elevation: 0, shadowOffset: { height: 0, width: 0 } }}
        activeColor="#18181b" // zinc-900
        inactiveColor="#71717a" // zinc-500
        renderLabel={({ route, focused, color }: { route: { title: string }, focused: boolean, color: string }) => (
          <AppText 
            className={focused ? "font-bold" : ""} 
            style={{ color }}
          >
            {route.title}
          </AppText>
        )}
      />
      <View className="px-4 pt-2 pb-3 border-b border-zinc-200">
        <Input
          placeholder={index === 0 ? "Search by title, author, or ISBN..." : index === 1 ? "Search users..." : "Search clubs..."}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AppText variant="title" className="ml-6 mt-4">Search</AppText>
      <View className="flex-1 px-4 mt-2">
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width - 32 }}
        />
      </View>
    </SafeAreaView>
  );
}