/* eslint-disable @typescript-eslint/no-unused-vars */
import AppText from "@/components/common/AppText";
import Buttons from "@/components/common/Buttons";
import DropdownButton from "@/components/button/DropdownButton";
import { useBookModal } from '@/contexts/BookModalContext';
import { Book } from "@/types/book";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Rating } from '@kolking/react-native-rating';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import React, { forwardRef, useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { ActivityIndicator, Image, View, TouchableOpacity, LayoutAnimation } from "react-native";
import Animated, { FadeInUp, FadeOutUp, LinearTransition } from 'react-native-reanimated';
import { supabase } from '@/app/lib/supabase';
import { gql, useMutation } from '@apollo/client';
import { CreateReviewModal } from './CreateReviewModal';
import CondensedReviewCard from '../card/CondensedReviewCard';
import { Plus, X } from 'lucide-react-native';
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
    const createReviewModalRef = useRef<BottomSheetModal>(null);

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

    const [olRating, setOlRating] = useState<number | null>(null);
    const [saveBookMutation] = useMutation(SAVE_BOOK_MUTATION);
    const { showAlert } = useAlert();
    const [addingShelfId, setAddingShelfId] = useState<string | null>(null);

    useEffect(() => {
        setOlRating(null);
        setIsMenuExpanded(false);
        setAddingShelfId(null);
    }, [book?.isbn]);

    // Fetch Open Library Rating
    useEffect(() => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

        async function fetchOLRating() {
            if (!book?.isbn) return;
            
            // Sanitize ISBN: remove all non-numeric characters except 'X' (for ISBN-10)
            const sanitizedIsbn = book.isbn.replace(/[^0-9X]/gi, '');
            if (!sanitizedIsbn) return;

            try {
                const response = await fetch(
                    `https://openlibrary.org/search.json?q=${sanitizedIsbn}&fields=ratings_average`,
                    { signal: controller.signal }
                );
                
                if (!response.ok) {
                    console.log(`Open Library API returned status ${response.status}`);
                    return;
                }

                const text = await response.text();
                if (!text || text.trim().length === 0) {
                    return;
                }

                const data = JSON.parse(text);
                if (data.docs && data.docs.length > 0) {
                    const rating = data.docs[0].ratings_average;
                    if (rating) {
                        setOlRating(rating);
                    }
                }
            } catch (err: any) {
                if (err.name === 'AbortError') {
                    console.log("OL rating fetch timed out");
                } else {
                    console.error("Error fetching OL rating:", err);
                }
            } finally {
                clearTimeout(timeoutId);
            }
        }
        fetchOLRating();
        
        return () => {
            controller.abort();
            clearTimeout(timeoutId);
        };
    }, [book?.isbn]);

    const releaseYear = book?.releaseYear || null;

    const infoText = [
        book?.publisher,
        book?.pageCount ? `${book.pageCount} Pages` : null,
        releaseYear
    ].filter(Boolean).join(' ◦ ');

    const [shelves, setShelves] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [bookOnShelf, setBookOnShelf] = useState<boolean>(false);

    // Reviews state
    const [topReviews, setTopReviews] = useState<any[]>([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [isReviewsExpanded, setIsReviewsExpanded] = useState(false);
    const [isMenuExpanded, setIsMenuExpanded] = useState(false);

    useEffect(() => {
        let mounted = true;
        async function fetchReviews() {
            if (!book?.isbn) return;
            setReviewsLoading(true);

            // Reset expansion state when changing books
            setIsReviewsExpanded(false);

            const { data, error } = await supabase
                .from('posts')
                .select(`
                    id, body, rating, created_at, post_type,
                    profiles!userId(id, username, first_name, last_name, avatar_url),
                    postLikes(count)
                `)
                .eq('book_isbn', book.isbn)
                .eq('post_type', 'review');

            if (!error && data) {
                const sorted = data.sort((a, b) => {
                    const likesA = a.postLikes?.[0]?.count || 0;
                    const likesB = b.postLikes?.[0]?.count || 0;
                    return likesB - likesA;
                });
                if (mounted) setTopReviews(sorted);
            }
            if (mounted) setReviewsLoading(false);
        }

        fetchReviews();
        return () => { mounted = false; };
    }, [book?.isbn]);

    const handleAddToShelf = async (shelfId: string) => {
        if (!book?.isbn) {
            showAlert('Error', 'This book cannot be added because it is missing an ISBN.', 'error');
            return;
        }
        if (addingShelfId) return; // prevent double-tap

        setAddingShelfId(shelfId);
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
                showAlert('Error', 'Failed to save book details.', 'error');
                setAddingShelfId(null);
                return;
            }

            const { error: shelfErr } = await supabase.from('shelfBooks').insert({
                shelf_id: shelfId,
                book_isbn: book.isbn,
            });

            if (shelfErr) {
                if (shelfErr.code === '23505') {
                    showAlert('Already in Shelf', 'This book is already in the selected shelf.', 'info');
                } else {
                    console.error("Shelf addition error:", shelfErr);
                    showAlert('Error', 'Failed to add book to shelf.', 'error');
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
                                const { data: currentProfile } = await supabase
                                    .from('profiles')
                                    .select(counterField)
                                    .eq('id', userData.user.id)
                                    .single();

                                if (currentProfile) {
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

                setIsMenuExpanded(false);
                showAlert('Added!', 'Book added to shelf.', 'success');
            }
        } catch (e: any) {
            console.error("Error adding to shelf:", e);
            showAlert('Error', e.message || 'An unexpected error occurred.', 'error');
        }
        setAddingShelfId(null);
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
            onDismiss={() => {
                setIsMenuExpanded(false);
                closeBookModal();
            }}
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
                        colors={[Colors.secondary, Colors.background]}
                        style={{ flex: 1 }}
                    />
                </View>
                <BottomSheetScrollView showsVerticalScrollIndicator={false} className="flex-1">
                    <View className="flex-row pt-10 pb-6 px-4 gap-4">
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
                                <AppText variant="title" numberOfLines={2}>{book?.title}</AppText>
                                <AppText variant="body" numberOfLines={1}>{book?.authors?.join(', ')}</AppText>
                                {/* This should be turned into a link */}
                                <AppText variant="label" className="pt-6">
                                    {infoText}
                                </AppText>
                                <View className="items-start pt-4">
                                    {olRating !== null ? (
                                        <View pointerEvents="none" className="flex-row items-center gap-2">
                                            <Rating
                                                size={30}
                                                rating={olRating}
                                                spacing={1.5}
                                                baseColor={Colors.mutedForeground}
                                                fillColor={Colors.primary}
                                                touchColor={Colors.primary}
                                            />
                                            <AppText className="font-fraunces-bold text-foreground pt-0.5">
                                                {olRating.toFixed(1)}
                                            </AppText>
                                        </View>
                                    ) : (
                                        <AppText variant="caption" className="text-muted-foreground italic">
                                            No ratings yet
                                        </AppText>
                                    )}
                                </View>
                            </View>
                            <View className="flex-row items-center gap-2 pt-2">
                                <TouchableOpacity
                                    className="w-10 h-10 rounded-full bg-[#73BDA8] items-center justify-center p-0"
                                    onPress={() => {
                                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                        setIsMenuExpanded(!isMenuExpanded);
                                    }}
                                >
                                    {isMenuExpanded ? (
                                        <X size={24} color="#FFF" />
                                    ) : (
                                        <Plus size={24} color="#FFF" />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    {isMenuExpanded && (
                        <Animated.View
                            entering={FadeInUp.duration(250)}
                            exiting={FadeOutUp.duration(250)}
                            className="px-6 py-2 mb-2"
                        >
                            <View className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                                {/* Shelf rows - inline with per-shelf loading spinner */}
                                <View className="border-b border-slate-200">
                                    <AppText
                                        variant="caption"
                                        className="text-muted-foreground px-4 pt-3 pb-1"
                                    >
                                        Add to shelf
                                    </AppText>
                                    {shelves.map((shelf, index) => (
                                        <TouchableOpacity
                                            key={shelf.id}
                                            onPress={() => handleAddToShelf(shelf.id)}
                                            disabled={!!addingShelfId}
                                            className={`flex-row items-center justify-between px-4 py-3 ${
                                                index < shelves.length - 1 ? 'border-b border-slate-100' : ''
                                            } ${addingShelfId && addingShelfId !== shelf.id ? 'opacity-40' : ''}`}
                                        >
                                            <AppText
                                                variant="body"
                                                className="font-fraunces-bold text-[#1e656d]"
                                            >
                                                {shelf.name}
                                            </AppText>
                                            {addingShelfId === shelf.id ? (
                                                <ActivityIndicator size="small" color={Colors.primary} />
                                            ) : (
                                                <View className="w-5 h-5" />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <TouchableOpacity
                                    className="py-4 items-center bg-white active:bg-slate-50 flex-row justify-center"
                                    disabled={!!addingShelfId}
                                    onPress={() => {
                                        setIsMenuExpanded(false);
                                        createReviewModalRef.current?.present();
                                    }}
                                >
                                    <AppText className="font-fraunces-bold text-[#1e656d] text-lg">Write Review</AppText>
                                    <View className="w-5 h-5 ml-2" />
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    )}
                    <Animated.View layout={LinearTransition.springify()}>
                        <View className="px-4 pt-2">
                            <AppText variant="collapsible" charLimit={150}>
                                {book?.description || ''}
                            </AppText>
                        </View>

                        <View className="px-4 pt-6">
                            <AppText variant="subtitle">Top Reviews</AppText>
                        </View>

                        {reviewsLoading ? (
                            <View className="px-4 py-8 items-center">
                                <AppText variant="body" className="text-slate-500">Loading reviews...</AppText>
                            </View>
                        ) : topReviews.length === 0 ? (
                            <View className="px-4 py-6">
                                <AppText variant="body" className="text-slate-500 italic font-fraunces-italic">No reviews yet for this book. Be the first!</AppText>
                            </View>
                        ) : (
                            <View className="px-4 pt-4 gap-y-3">
                                {topReviews.slice(0, isReviewsExpanded ? undefined : 3).map((review) => (
                                    <CondensedReviewCard
                                        key={`condensed-review-${review.id}`}
                                        firstName={review.profiles?.first_name || "Unknown"}
                                        lastName={review.profiles?.last_name || ""}
                                        username={review.profiles?.username || "unknown"}
                                        uriAvatar={review.profiles?.avatar_url}
                                        userRating={review.rating}
                                        postText={review.body}
                                        timestamp={review.created_at}
                                        likesCount={review.postLikes?.[0]?.count || 0}
                                        userId={review.profiles?.id}
                                        onPressProfile={() => {
                                            if (ref && 'current' in ref && ref.current) {
                                                ref.current.dismiss();
                                            }
                                        }}
                                    />
                                ))}
                                {topReviews.length > 3 && (
                                    <TouchableOpacity
                                        className="py-3 items-center border border-slate-200 rounded-xl mt-2 active:bg-slate-50"
                                        onPress={() => setIsReviewsExpanded(!isReviewsExpanded)}
                                    >
                                        <AppText className="text-primary font-fraunces-bold">
                                            {isReviewsExpanded ? "Show Less" : `Show All ${topReviews.length} Reviews`}
                                        </AppText>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}

                        <View className="px-4 pt-8 pb-12">
                            <AppText variant="subtitle">More Like This</AppText>
                        </View>
                    </Animated.View>
                </BottomSheetScrollView>
            </View>
            <CreateReviewModal
                ref={createReviewModalRef}
                selectedBook={book}
                onReviewCreated={() => {
                    showAlert('Review Posted!', 'Your review was created successfully.', 'success');
                }}
            />
        </BottomSheetModal>
    );
});
BookInfoModal.displayName = 'BookInfoModal';
