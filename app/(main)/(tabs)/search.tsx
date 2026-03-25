import BookItem from '@/components/book/BookItem';
import AppText from '@/components/common/AppText';
import Input from '@/components/common/Input';
import { useBookSearch } from '@/hooks/useBookSearch';
import { useBookRecommendations } from '@/hooks/useBookRecommendations';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  View,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  Animated,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { X } from 'lucide-react-native';

const BooksTab = ({ searchQuery }: { searchQuery: string }) => {
  const isSearchActive = !!searchQuery && searchQuery.trim().length > 0;
  
  const searchResult = useBookSearch(searchQuery);
  const recResult = useBookRecommendations();

  useFocusEffect(
    useCallback(() => {
      // Only refetch recommendations if we aren't actively searching
      if (!isSearchActive && recResult.refetch) {
        recResult.refetch({ offset: 0 });
      }
    }, [isSearchActive, recResult.refetch])
  );

  const isLoading = isSearchActive ? searchResult.loading : recResult.loading;
  const error = isSearchActive ? searchResult.error : recResult.error;
  const books = isSearchActive ? searchResult.books : recResult.books;
  const loadMore = isSearchActive ? () => {} : recResult.loadMore;

  const { width } = useWindowDimensions();
  const itemWidth = (width - 64) / 3;

  return (
    <View className="flex-1">
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
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 48 }}
          columnWrapperStyle={{ justifyContent: 'flex-start', marginBottom: 16, gap: 16 }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          renderItem={({ item }) => (
            <BookItem 
              book={item} 
              className="" 
              style={{ width: itemWidth, height: itemWidth * 1.5 }} 
            />
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
  <View className="flex-1 justify-center items-center" pointerEvents="box-none">
    <AppText className="text-zinc-500">Users search coming soon.</AppText>
  </View>
);

const ClubsTab = () => (
  <View className="flex-1 justify-center items-center" pointerEvents="box-none">
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

  const position = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(position, {
      toValue: index,
      useNativeDriver: true,
      bounciness: 0,
    }).start();
  }, [index]);

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
        tabStyle={{ minHeight: 48, paddingVertical: 12 }}
        activeColor="#18181b" // zinc-900
        inactiveColor="#71717a" // zinc-500
        renderLabel={({ route, focused, color }: { route: { title: string }, focused: boolean, color: string }) => (
          <AppText 
            style={{ color }}
          >
            {route.title}
          </AppText>
        )}
      />
      <View className="px-4 pt-2 pb-3 border-b border-zinc-200">
        <View className="relative justify-center">
          <Input
            placeholder={index === 0 ? "Search by title, author, or ISBN..." : index === 1 ? "Search users..." : "Search clubs..."}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={() => setSearchQuery('')} 
              className="absolute right-3 top-4 p-1 z-10"
            >
              <X size={16} color="#a1a1aa" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <AppText variant="title" className="ml-6 mt-4">Search</AppText>
      <View className="flex-1 mt-2">
        {renderTabBar({ 
          navigationState: { index, routes },
          position: position, 
          layout: { width: layout.width - 32 },
          jumpTo: (key: string) => {
            const newIndex = routes.findIndex(r => r.key === key);
            if (newIndex >= 0) setIndex(newIndex);
          }
        })}
        <View className="flex-1 bg-[#F2F0E9] relative">
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'transparent']}
            style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 18, zIndex: 10 }}
            pointerEvents="none"
          />
          {renderScene({ route: routes[index] })}
        </View>
      </View>
    </SafeAreaView>
  );
}