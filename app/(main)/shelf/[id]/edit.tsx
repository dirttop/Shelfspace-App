import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/app/lib/supabase';
import { Book } from '@/types/book';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '@/components/common/AppText';
import { ChevronLeft, GripVertical, Trash2, Plus } from 'lucide-react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SearchBookForReviewModal } from '@/components/modals/SearchBookForReviewModal';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Colors } from '@/constants/Colors';
import { gql, useMutation } from '@apollo/client';
import { useAlert } from '@/contexts/AlertContext';

const SAVE_BOOK_MUTATION = gql`
  mutation SaveBook(
    $title: String!
    $authors: [String!]!
    $description: String
    $coverImage: String
    $pageCount: Int
    $publisher: String
    $isbn: String!
    $releaseYear: String
    $source: String!
  ) {
    saveBook(
      title: $title
      authors: $authors
      description: $description
      coverImage: $coverImage
      pageCount: $pageCount
      publisher: $publisher
      isbn: $isbn
      releaseYear: $releaseYear
      source: $source
    ) {
      isbn
    }
  }
`;

type ShelfBook = Book & { shelfBookId: string; position: number };

export default function EditShelfScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [shelfName, setShelfName] = useState<string>('');
  const [books, setBooks] = useState<ShelfBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const searchModalRef = useRef<BottomSheetModal>(null);
  const [saveBookMutation] = useMutation(SAVE_BOOK_MUTATION);
  const { showConfirm, showAlert } = useAlert();

  const shelfId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : '';

  useEffect(() => {
    let mounted = true;

    async function fetchShelfDetails() {
      if (!shelfId) return;

      const { data: shelfData } = await supabase
        .from('shelves')
        .select('name')
        .eq('id', shelfId)
        .single();

      if (shelfData && mounted) {
        setShelfName(shelfData.name);
      }

      const { data, error } = await supabase
        .from('shelfBooks')
        .select('id, position, book_isbn, books(*)')
        .eq('shelf_id', shelfId)
        .order('position', { ascending: true });

      if (!error && data && mounted) {
        const mappedList = data.map((item: any) => {
          const bData = item.books || item.book;
          if (!bData) return null;
          return {
            ...bData,
            coverImage: bData.cover_image,
            pageCount: bData.page_count,
            releaseYear: bData.release_year,
            shelfBookId: item.id,
            position: item.position || 0,
          };
        }).filter(Boolean) as ShelfBook[];
        setBooks(mappedList);
      }
      if (mounted) setLoading(false);
    }

    fetchShelfDetails();
    return () => { mounted = false; };
  }, [shelfId]);

  const removeBook = async (bookId: string, shelfBookId: string) => {
    showConfirm(
      'Remove Book',
      'Are you sure you want to remove this book from the shelf?',
      async () => {
        setBooks(prev => prev.filter(b => b.shelfBookId !== shelfBookId));
        const { error } = await supabase
          .from('shelfBooks')
          .delete()
          .eq('id', shelfBookId);
        if (error) {
          showAlert('Error', 'Could not remove book', 'error');
        }
      },
      { confirmText: 'Remove', destructive: true }
    );
  };

  const onDragEnd = async ({ data }: { data: ShelfBook[] }) => {
    // Determine new positions sequentially
    const updatedBooks = data.map((book, index) => ({
      ...book,
      position: index,
    }));
    setBooks(updatedBooks);

    // Save new positions to DB
    try {
      // Supabase lacks a bulk upsert that returns arrays sometimes without complex logic, so we loop or do batch RPC.
      // Small arrays: loop is fine for now
      await Promise.all(
        updatedBooks.map((book) =>
          supabase
            .from('shelfBooks')
            .update({ position: book.position })
            .eq('id', book.shelfBookId)
        )
      );
    } catch (err) {
      console.error('Failed to update positions', err);
    }
  };

  const handleAddBook = async (book: Book) => {
    if (!book.isbn || !shelfId) return;

    // Check if already in shelf
    if (books.some(b => b.isbn === book.isbn)) {
      showAlert('Already on Shelf', 'This book is already on the shelf.', 'info');
      return;
    }

    setIsAdding(true);
    try {
      // Step 1: Upsert the book into the local `books` table first.
      // Books from the search API may not yet exist in Supabase, so the
      // shelfBooks foreign key constraint would fail without this.
      await saveBookMutation({
        variables: {
          title: book.title || '',
          authors: book.authors || [],
          description: book.description || '',
          coverImage: book.coverImage || '',
          pageCount: book.pageCount || 0,
          publisher: book.publisher || '',
          isbn: book.isbn,
          releaseYear: book.releaseYear || '',
          source: book.source || 'Google Books',
        },
      });
    } catch (saveErr) {
      console.error('Failed to save book:', saveErr);
      showAlert('Error', 'Failed to save book details.', 'error');
      setIsAdding(false);
      return;
    }

    const newPosition = books.length;

    // Step 2: Now insert into shelfBooks — the book is guaranteed to exist.
    const { data, error } = await supabase
      .from('shelfBooks')
      .insert({
        shelf_id: shelfId,
        book_isbn: book.isbn,
        position: newPosition,
      })
      .select('id')
      .single();

    if (error) {
      if (error.code === '23505') {
        showAlert('Already on Shelf', 'This book is already in this shelf.', 'info');
      } else {
        console.error('Shelf insert error:', error);
        showAlert('Error', 'Failed to add book to shelf.', 'error');
      }
    } else if (data) {
      setBooks(prev => [...prev, { ...book, shelfBookId: data.id, position: newPosition }]);
    }
    setIsAdding(false);
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<ShelfBook>) => {
    return (
      <TouchableOpacity
        onLongPress={drag}
        activeOpacity={0.8}
        className={`flex-row items-center bg-white border border-border rounded-xl mb-3 p-3 shadow-sm ${isActive ? 'opacity-80 scale-105 shadow-md' : ''}`}
        style={{ elevation: isActive ? 5 : 1 }}
      >
        <GripVertical size={24} color={Colors.mutedForeground} className="mr-3" />

        {item.coverImage ? (
          <Image source={{ uri: item.coverImage }} className="w-12 h-16 rounded mr-3" />
        ) : (
          <View className="w-12 h-16 bg-muted rounded justify-center items-center mr-3">
            <AppText variant="caption">No Cover</AppText>
          </View>
        )}

        <View className="flex-1 justify-center relative">
          <AppText variant="body" className="font-fraunces-bold" numberOfLines={2}>
            {item.title}
          </AppText>
          <AppText variant="caption" className="text-muted-foreground" numberOfLines={1}>
            {item.authors?.join(', ')}
          </AppText>
        </View>

        <TouchableOpacity
          onPress={() => removeBook(item.isbn || '', item.shelfBookId)}
          className="p-3 bg-destructive/10 rounded-full ml-2"
        >
          <Trash2 size={20} color={Colors.destructive} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={{ paddingTop: insets.top }} className="flex-row items-center px-4 mb-4 mt-2 justify-between">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <ChevronLeft size={28} color="#0f172a" />
          </TouchableOpacity>
          <AppText variant="title" className="ml-2 text-xl font-fraunces-bold">{shelfName}</AppText>
        </View>
        <TouchableOpacity
          onPress={() => searchModalRef.current?.present()}
          disabled={isAdding}
          className="w-10 h-10 rounded-full bg-muted items-center justify-center shadow-sm"
        >
          {isAdding ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <Plus size={24} color={Colors.foreground} />
          )}
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View className="flex-1">
          {/* Adding book overlay banner */}
          {isAdding && (
            <View
              style={{ backgroundColor: Colors.primary }}
              className="flex-row items-center justify-center gap-x-2 py-3 mx-4 mb-3 rounded-xl"
            >
              <ActivityIndicator size="small" color="#fff" />
              <AppText variant="label" style={{ color: '#fff' }}>Adding book to shelf...</AppText>
            </View>
          )}
          {books.length === 0 && !isAdding ? (
            <View className="flex-1 justify-center items-center px-6">
              <AppText variant="subtitle" className="text-muted-foreground text-center">Shelf is empty</AppText>
              <AppText variant="body" className="text-muted-foreground opacity-70 text-center mt-2">Tap the + icon to add books</AppText>
            </View>
          ) : (
            <DraggableFlatList
              data={books}
              onDragEnd={onDragEnd}
              keyExtractor={(item) => item.shelfBookId}
              renderItem={renderItem}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: Math.max(insets.bottom, 24) + 80 }}
            />
          )}
        </View>
      )}

      <SearchBookForReviewModal
        ref={searchModalRef}
        onBookSelected={handleAddBook}
      />
    </GestureHandlerRootView>
  );
}
