import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView, BottomSheetTextInput, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useMemo, useState, useEffect } from 'react';
import { View, Keyboard, Platform, TouchableWithoutFeedback, ActivityIndicator, TouchableOpacity, Image, TextInput } from 'react-native';
import AppText from '../common/AppText';
import { useBookSearch } from '@/hooks/useBookSearch';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, X } from 'lucide-react-native';
import { Book } from '@/types/book';

export type SearchBookForReviewModalProps = {
  onBookSelected: (book: Book) => void;
};

export const SearchBookForReviewModal = forwardRef<BottomSheetModal, SearchBookForReviewModalProps>(
  ({ onBookSelected }, ref) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const { books, loading, error } = useBookSearch(debouncedQuery);
    const insets = useSafeAreaInsets();

    const snapPoints = useMemo(() => ['90%'], []);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.3}
          pressBehavior="close"
        />
      ),
      []
    );

    const handleDismiss = useCallback(() => {
      Keyboard.dismiss();
      setSearchQuery('');
      setDebouncedQuery('');
    }, []);

    useEffect(() => {
      const timer = setTimeout(() => setDebouncedQuery(searchQuery), 500);
      return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSelect = (book: Book) => {
      Keyboard.dismiss();
      if (ref && 'current' in ref && ref.current) {
        ref.current.dismiss();
      }
      onBookSelected(book);
    };

    const content = (
      <BottomSheetView style={{ flex: 1, backgroundColor: 'white' }} className="pt-2 flex-1">
        <View className="px-6 mb-4">
          <AppText variant="title" className="mb-4">Find a Book to Review</AppText>
          <View className="flex-row items-center bg-muted rounded-xl px-4 py-2 border border-slate-200">
            <Search size={20} color="#a1a1aa" />
            {Platform.OS === 'web' ? (
              <TextInput
                className="flex-1 ml-2 text-base text-foreground custom-font-regular py-2 outline-none"
                placeholder="Search by title, author, or ISBN..."
                placeholderTextColor="#a1a1aa"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
                style={{ outlineStyle: 'none' } as any}
              />
            ) : (
              <BottomSheetTextInput
                className="flex-1 ml-2 text-base text-foreground custom-font-regular py-2"
                placeholder="Search by title, author, or ISBN..."
                placeholderTextColor="#a1a1aa"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
              />
            )}
            {searchQuery.length > 0 && Platform.OS !== 'ios' && (
              <TouchableOpacity onPress={() => setSearchQuery('')} className="p-1">
                <X size={16} color="#a1a1aa" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {loading && <ActivityIndicator className="mt-4" size="large" />}
        {error && <AppText className="text-maroon-500 text-center mt-4 px-6">Error loading books.</AppText>}
        
        {!loading && !error && books.length === 0 && debouncedQuery.length > 0 && (
          <AppText className="text-center mt-4 text-zinc-500 px-6">No books found.</AppText>
        )}

        <BottomSheetFlatList
          data={books}
          keyboardShouldPersistTaps="handled"
          keyExtractor={(item: Book, index: number) => item.isbn ? item.isbn : `${item.title}-${index}`}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: Math.max(insets.bottom, 24) }}
          renderItem={({ item }: { item: Book }) => (
            <TouchableOpacity 
              className="flex-row py-3 border-b border-slate-100 items-center"
              onPress={() => handleSelect(item)}
              activeOpacity={0.7}
            >
              {item.coverImage ? (
                <Image source={{ uri: item.coverImage }} className="w-12 h-16 rounded mr-4 bg-slate-100" resizeMode="cover" />
              ) : (
                <View className="w-12 h-16 bg-slate-200 rounded mr-4 items-center justify-center">
                  <AppText variant="caption">No Cover</AppText>
                </View>
              )}
              <View className="flex-1 justify-center">
                <AppText className="font-fraunces-bold text-base" numberOfLines={2}>{item.title}</AppText>
                <AppText variant="caption" className="text-slate-500 mt-1" numberOfLines={1}>
                  {item.authors?.join(', ') || 'Unknown Author'}
                </AppText>
              </View>
            </TouchableOpacity>
          )}
        />
      </BottomSheetView>
    );

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: 'white' }}
        handleIndicatorStyle={{ backgroundColor: '#A1A1AA', opacity: 0.8 }}
        onDismiss={handleDismiss}
        keyboardBehavior="extend"
      >
        {content}
      </BottomSheetModal>
    );
  }
);
