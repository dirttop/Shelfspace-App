import AppText from "@/components/common/AppText";
import Buttons from "@/components/common/Buttons";
import DropdownButton from "@/components/button/DropdownButton";
import { useBookModal } from '@/contexts/BookModalContext';
import { Book } from "@/types/book";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Rating } from '@kolking/react-native-rating';
import { LinearGradient } from 'expo-linear-gradient';
import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Image, View } from "react-native";
import { supabase } from '@/app/lib/supabase';
import { gql, useMutation } from '@apollo/client';

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

const placeholderBook: Book = {
    isbn: "0000000000000",
    title: "Title Placeholder",
    authors: ["Author Placeholder"],
    description: "Description Placeholder",
    publisher: "Publisher Placeholder",
    pageCount: 0,
    source: "Google Books",
    coverImage: "", 
    globalRating: 0,
    releaseYear: "",
};
export const BookInfoModal = forwardRef<BottomSheetModal>((props, ref) => {
    const { selectedBook, closeBookModal } = useBookModal();
    const book = selectedBook || placeholderBook;
    
    const snapPoints = useMemo(() => ['90%'], []);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.3}
          onPress={closeBookModal}
        />
      ),
      [closeBookModal]
    );

    const [userRating, setUserRating] = useState<number | null>(null);
    const [saveBookMutation] = useMutation(SAVE_BOOK_MUTATION);

    useEffect(() => {
        setUserRating(null);
    }, [book?.isbn]);

    const displayRating = userRating !== null ? userRating : (book?.globalRating || 0);
    const releaseYear = book?.releaseYear || null;

    const infoText = [
        book?.publisher,
        book?.pageCount ? `${book.pageCount} Pages` : null,
        releaseYear
    ].filter(Boolean).join(' ◦ ');

    const handleChange = useCallback(
        (value: number) => {
            setUserRating(Math.round(value * 2) / 2);
        },
        [],
    );

    const [shelves, setShelves] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [bookOnShelf, setBookOnShelf] = useState<boolean>(false);

    const handleAddToShelf = async (shelfId: string) => {
        if (!book?.isbn) {
            Alert.alert("Error", "This book cannot be added because it is missing an ISBN.");
            return;
        }

        try {
            try {
                await saveBookMutation({
                    variables: {
                        title: book.title || "",
                        authors: book.authors || [],
                        description: book.description || "",
                        coverImage: book.coverImage || "",
                        pageCount: book.pageCount || 0,
                        publisher: book.publisher || "",
                        isbn: book.isbn,
                        releaseYear: book.releaseYear || "",
                        source: book.source || "Unknown"
                    }
                });
            } catch (bookErr: any) {
                console.error("Book upsert error:", bookErr);
                Alert.alert("Error", "Failed to save book details.");
                return;
            }

            const { error: shelfErr } = await supabase.from('shelf_books').insert({
                shelf_id: shelfId,
                book_isbn: book.isbn,
            });

            if (shelfErr) {
                if (shelfErr.code === '23505') {
                    Alert.alert("In Shelf", "This book is already in the selected shelf.");
                } else {
                    console.error("Shelf addition error:", shelfErr);
                    Alert.alert("Error", "Failed to add book to shelf.");
                }
            } else {
                // Determine if we need to update reading/read counts in the profiles table
                const targetShelf = shelves.find(s => s.id === shelfId);
                if (targetShelf) {
                    const shelfNameStr = targetShelf.name?.toLowerCase();
                    let counterField: 'read_count' | 'reading_count' | null = null;
                    if (shelfNameStr === 'read') counterField = 'read_count';
                    else if (shelfNameStr === 'reading') counterField = 'reading_count';

                    if (counterField) {
                        try {
                            const { data: userData } = await supabase.auth.getUser();
                            if (userData?.user) {
                                // fetch current count
                                const { data: currentProfile } = await supabase
                                    .from('profiles')
                                    .select(counterField)
                                    .eq('id', userData.user.id)
                                    .single();
                                
                                if (currentProfile) {
                                    // increment
                                    const currentCount = (currentProfile as any)[counterField] || 0;
                                    await supabase
                                        .from('profiles')
                                        .update({ [counterField]: currentCount + 1 })
                                        .eq('id', userData.user.id);
                                }
                            }
                        } catch (err) {
                            console.error("Failed to increment profile count", err);
                        }
                    }
                }

                Alert.alert("Success", "Book added to shelf!");
            }
        } catch (e: any) {
            console.error("Error adding to shelf:", e);
            Alert.alert("Error", e.message || "An unexpected error occurred.");
        }
    };

    useEffect(() => {
        let mounted = true;

        async function fetchData() {
            if (!selectedBook) return; // Only fetch when the modal is opened

            setLoading(true);
            setError(null);

            const { data: userData, error: userErr } = await supabase.auth.getUser();
            if (userErr || !userData?.user) {
                if (mounted) setError(userErr?.message ?? "Not signed in");
                if (mounted) setLoading(false);
                return;
            }

            const userId = userData.user.id;

            const { data: shelvesData, error: shelvesErr } = await supabase
                .from("shelves")
                .select(
                  "id, name, created_at",
                )
                .eq("user_id", userId);

            if (shelvesErr) {
                if (mounted) setError(shelvesErr.message);
            } else {
                if (mounted) setShelves(shelvesData ?? []);
            }

            if (mounted) setLoading(false);
        }

        fetchData();

        return () => {
            mounted = false;
        };
    }, [selectedBook]);

    return (
        <BottomSheetModal
            ref={ref}
            index={0}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            enablePanDownToClose={true}
            enableDynamicSizing={false}
            onDismiss={closeBookModal}
            backgroundStyle={{ backgroundColor: 'transparent' }}
            handleIndicatorStyle={{ backgroundColor: 'var(--muted-foreground)', opacity: 0.3 }}
            handleStyle={{ 
                position: 'absolute',
                top: 0,
                width: '100%',
                zIndex: 10
            }}
            topInset={0}
        >
            <View className="flex-1 bg-background overflow-hidden rounded-t-2xl">
                <View className="absolute top-0 w-full h-[35vh]">
                    <LinearGradient 
                        colors={["#B2D3C2", "#F9F8F2"]}
                        className="flex-1"
                    />
                </View>
                <BottomSheetScrollView showsVerticalScrollIndicator={false} className="flex-1">
                    <View className="flex-row pt-[4vh] pb-6 px-4 gap-4">
                        {book?.coverImage ? (
                            <Image 
                                source={{ uri: book.coverImage }} 
                                className="w-40 h-60 rounded-md"
                                resizeMode="cover"
                            />
                        ) : (
                            <View className="w-40 h-60 bg-slate-200 dark:bg-slate-800 rounded-md items-center">
                                <AppText>No Cover</AppText>
                            </View>
                        )}
                        <View className="flex-1 flex-col justify-between py-1">
                            <View>
                                <AppText variant="subtitle" numberOfLines={2}>{book?.title}</AppText>
                                <AppText variant="body" numberOfLines={1}>{book?.authors?.join(', ')}</AppText> 
                                {/* This should be turned into a link */}
                                <AppText variant="label" className="pt-6">
                                    {infoText}
                                </AppText>
                                <View className="items-start pt-4">
                                    <Rating 
                                        variant="hearts-outline" 
                                        size={30} 
                                        rating={displayRating} 
                                        onChange={handleChange}
                                        spacing={.5}
                                        baseSymbol={require('@/assets/images/icons/heart-line.png')}
                                        fillSymbol={require('@/assets/images/icons/heart-fill.png')}
                                        baseColor="#71717a"
                                        fillColor="#FF2D55"
                                    />
                                </View>
                            </View>
                            <View className="items-start">
                                <DropdownButton 
                                    title="Add to Shelf"
                                    variant="secondary"
                                    dropdownPosition="right"
                                    menuOnly={true}
                                    dropdownItems={[
                                        ...shelves.map(shelf => ({
                                            label: shelf.name,
                                            onPress: () => handleAddToShelf(shelf.id)
                                        }))
                                    ]}
                                />
                            </View>
                        </View>
                    </View>
                    <View className="px-4 pt-2">
                        <AppText variant="collapsible" charLimit={150}>
                            {book?.description || ''}
                        </AppText>
                    </View>
                    <View className="px-4 pt-6">
                        <AppText variant="subtitle">Top Reviews</AppText>
                    </View>
                    <View className="px-4 pt-6 pb-12">
                        <AppText variant="subtitle">More Like This</AppText>
                    </View>
                </BottomSheetScrollView>
            </View>
        </BottomSheetModal>
    );
});