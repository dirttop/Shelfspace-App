import AppText from "@/components/common/AppText";
import Buttons from "@/components/common/Buttons";
import { useBookModal } from '@/contexts/BookModalContext';
import { Book } from "@/types/book";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Rating } from '@kolking/react-native-rating';
import { LinearGradient } from 'expo-linear-gradient';
import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { Image, View } from "react-native";
// Temporary mock data for boilerplating
const mockBook: Book = {
    isbn: "9780765326355",
    title: "The Way of Kings",
    authors: ["Brandon Sanderson"],
    description: "Set on the storm-ravaged world of Roshar, The Way of Kings is a massive epic fantasy that follows three converging destinies: Kaladin, a brilliant soldier turned broken slave; Shallan, a scholar seeking to save her family through a daring heist; and Dalinar, a highprince haunted by visions of an ancient, holy war. As a decade-long conflict grinds on at the Shattered Plains, these characters must navigate a world where social caste is determined by eye color and legendary artifacts like Shardblades grant god-like power. The story serves as a slow-burn exploration of leadership and trauma, ultimately building toward the rediscovery of the Knights Radiant—an extinct order of heroes whose return may be the only thing standing against a looming, world-ending apocalypse.",
    publisher: "Tor Books",
    pageCount: 1007,
    source: "Google Books",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780765326355-L.jpg", 
    globalRating: 4.5,
    releaseDate: "2010-08-31",
};
export const BookInfoModal = forwardRef<BottomSheetModal>((props, ref) => {
    const { selectedBook, closeBookModal } = useBookModal();
    const book = selectedBook || mockBook; // Fallback to mockBook
    
    const snapPoints = useMemo(() => ['95%'], []);

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

    // Reset user rating if book changes
    useEffect(() => {
        setUserRating(null);
    }, [book?.isbn]);

    const displayRating = userRating !== null ? userRating : (book?.globalRating || 0);
    const releaseYear = book?.releaseDate ? new Date(book.releaseDate).getFullYear() : null;

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
                        colors={["#78C0A8", "#F9F8F2"]}
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
                                <Buttons 
                                    title="Add to Shelf"
                                    onPress={() => console.log('pressed')}
                                    dropdownPosition="right"
                                    dropdownItems={[
                                        {
                                            label: 'Reading',
                                            onPress: () => console.log('Reading')
                                        },
                                        {
                                            label: 'Read',
                                            onPress: () => console.log('Read')
                                        },
                                        {
                                            label: 'Shelf 1',
                                            onPress: () => console.log('Shelf 1')
                                        }
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