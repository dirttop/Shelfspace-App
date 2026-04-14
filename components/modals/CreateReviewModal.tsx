/* eslint-disable @typescript-eslint/no-unused-vars */
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView, BottomSheetScrollView, BottomSheetTextInput, BottomSheetFooter } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useMemo, useState, useEffect } from 'react';
import { View, Keyboard, Platform, TouchableWithoutFeedback, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import AppText from '../common/AppText';
import Buttons from '../common/Buttons';
import { supabase } from '@/app/lib/supabase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronDown, Keyboard as KeyboardIcon } from 'lucide-react-native';
import { Rating } from '@kolking/react-native-rating';
import { Book } from '@/types/book';
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

export type CreateReviewModalProps = {
  onReviewCreated?: () => void;
  selectedBook: Book | null;
};

export const CreateReviewModal = forwardRef<BottomSheetModal, CreateReviewModalProps>(
  ({ onReviewCreated, selectedBook }, ref) => {
    const [postText, setPostText] = useState('');
    const [userRating, setUserRating] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const insets = useSafeAreaInsets();
    
    const [saveBookMutation] = useMutation(SAVE_BOOK_MUTATION);
    const { showAlert } = useAlert();

    const MAX_CHARS = 1000; // allow a bit more text for reviews
    const charsRemaining = MAX_CHARS - postText.length;
    const isOverLimit = charsRemaining < 0;
    const counterColor = isOverLimit ? Colors.destructive : charsRemaining <= 50 ? Colors.warningOrange : charsRemaining <= 150 ? Colors.warningYellow : Colors.mutedForeground;

    const snapPoints = useMemo(() => ['50%', '90%'], []);

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
    }, []);

    const handleSubmit = async () => {
      if (!selectedBook) {
        showAlert('Error', 'No book selected.', 'error');
        return;
      }
      if (userRating === 0) {
        showAlert('Error', 'Please provide a rating.', 'error');
        return;
      }
      
      setIsSubmitting(true);
      try {
        const { data: userData, error: userErr } = await supabase.auth.getUser();
        if (userErr || !userData.user) {
          throw new Error('You must be logged in to post.');
        }

        // 1. Ensure the book exists in the DB first to satisfy foreign key constraint
        try {
          await saveBookMutation({
            variables: {
              title: selectedBook.title || "",
              authors: selectedBook.authors || [],
              description: selectedBook.description || "",
              coverImage: selectedBook.coverImage || "",
              pageCount: selectedBook.pageCount || 0,
              publisher: selectedBook.publisher || "",
              isbn: selectedBook.isbn,
              releaseYear: selectedBook.releaseYear || "",
              source: selectedBook.source || "Unknown"
            }
          });
        } catch (bookErr: any) {
          console.error("Book upsert error in Review Modal:", bookErr);
          throw new Error("Failed to save book details before posting review.");
        }

        // 2. Insert into posts table
        const { error: insertErr } = await supabase
          .from('posts')
          .insert({
            userId: userData.user.id,
            body: postText.trim() === '' ? null : postText,
            post_type: 'review',
            rating: userRating,
            book_isbn: selectedBook.isbn,
          });

        if (insertErr) throw insertErr;

        // Notify friends
        try {
          const { data: friendsData } = await supabase
            .from('friends')
            .select('user_id, friend_id')
            .eq('status', 'accepted')
            .or(`user_id.eq.${userData.user.id},friend_id.eq.${userData.user.id}`);

          if (friendsData && friendsData.length > 0) {
            const friendIds = friendsData.map(f => f.user_id === userData.user.id ? f.friend_id : f.user_id);
            const notificationsToInsert = friendIds.map(fid => ({
               receiverId: fid,
               senderId: userData.user.id,
               title: `posted a review on ${selectedBook.title}!`,
               data: JSON.stringify({ type: 'new_review', bookTitle: selectedBook.title })
            }));
            
            supabase.from('notifications').insert(notificationsToInsert).then(({error})=> {
              if (error) console.error('Failed to notify friends:', error)
            });
          }
        } catch (e) {
          console.error('Notification error:', e);
        }
        
        // Clear draft and dismiss modal
        setPostText('');
        setUserRating(0);
        if (ref && 'current' in ref && ref.current) {
          ref.current.dismiss();
        }
        
        if (onReviewCreated) {
          onReviewCreated();
        }
      } catch (error: any) {
        showAlert('Error', error.message || 'Failed to create review', 'error');
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleRatingChange = useCallback((value: number) => {
      setUserRating(Math.round(value * 2) / 2);
    }, []);

    const renderFooter = useCallback(
      (footerProps: any) => (
        <BottomSheetFooter {...footerProps} bottomInset={0}>
          <View 
            className="bg-white px-6 py-4 border-t border-slate-100" 
            style={{ paddingBottom: Math.max(insets.bottom, 16) }}
          >
            <Buttons
              title={isSubmitting ? "Posting..." : "Post Review"}
              onPress={handleSubmit}
              disabled={isSubmitting || isOverLimit || userRating === 0 || !selectedBook}
            />
          </View>
        </BottomSheetFooter>
      ),
      [insets.bottom, isSubmitting, isOverLimit, userRating, selectedBook]
    );

    const content = (
      <View className="px-6 pt-2 flex-1">
        <View className="flex-row items-center justify-between mb-4">
          <AppText variant="title">Write a Review</AppText>
          <View className="flex-row items-center gap-3">
            <AppText
              variant="caption"
              style={{ color: counterColor, fontVariant: ['tabular-nums'], minWidth: 30, textAlign: 'right' }}
            >
              {charsRemaining}
            </AppText>
            <TouchableOpacity
              onPress={Keyboard.dismiss}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              className="bg-muted rounded-full p-1.5 flex-row items-center gap-1"
            >
              <KeyboardIcon size={14} color={Colors.mutedForeground} />
              <ChevronDown size={14} color={Colors.mutedForeground} />
            </TouchableOpacity>
          </View>
        </View>

        {Platform.OS === 'web' ? (
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}>
            {selectedBook && (
              <View className="flex-row mb-4 bg-slate-50 p-3 rounded-xl items-center">
                {selectedBook.coverImage ? (
                  <Image source={{ uri: selectedBook.coverImage }} className="w-12 h-16 rounded mr-3" resizeMode="cover" />
                ) : (
                  <View className="w-12 h-16 bg-slate-200 rounded mr-3 items-center justify-center">
                    <AppText variant="caption">No Cover</AppText>
                  </View>
                )}
                <View className="flex-1">
                  <AppText className="font-fraunces-bold" numberOfLines={1}>{selectedBook.title}</AppText>
                  <AppText variant="caption" className="text-muted-foreground" numberOfLines={1}>{selectedBook.authors?.join(', ')}</AppText>
                </View>
              </View>
            )}

            <View className="items-center mb-6">
              <Rating 
                size={40} 
                rating={userRating} 
                onChange={handleRatingChange}
                spacing={1.5}
                baseColor={Colors.mutedForeground}
                fillColor={Colors.primary}
                touchColor={Colors.primary}
              />
            </View>

            <TextInput
              className="bg-muted p-4 rounded-xl text-base mb-4 text-foreground custom-font-regular"
              style={{ minHeight: 120, textAlignVertical: 'top' }}
              placeholder="What did you think of this book?"
              placeholderTextColor={Colors.mutedForeground}
              multiline
              value={postText}
              onChangeText={setPostText}
              maxLength={MAX_CHARS}
              autoCorrect={true}
              spellCheck={true}
            />
          </ScrollView>
        ) : (
          <BottomSheetScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}>
            {selectedBook && (
              <View className="flex-row mb-4 bg-muted p-3 rounded-xl items-center">
                {selectedBook.coverImage ? (
                  <Image source={{ uri: selectedBook.coverImage }} className="w-12 h-16 rounded mr-3" resizeMode="cover" />
                ) : (
                  <View className="w-12 h-16 bg-muted rounded mr-3 items-center justify-center">
                    <AppText variant="caption">No Cover</AppText>
                  </View>
                )}
                <View className="flex-1">
                  <AppText className="font-fraunces-bold" numberOfLines={1}>{selectedBook.title}</AppText>
                  <AppText variant="caption" className="text-muted-foreground" numberOfLines={1}>{selectedBook.authors?.join(', ')}</AppText>
                </View>
              </View>
            )}

            <View className="items-center mb-6">
              <Rating 
                size={40} 
                rating={userRating} 
                onChange={handleRatingChange}
                spacing={1.5}
                baseColor={Colors.mutedForeground}
                fillColor={Colors.primary}
                touchColor={Colors.primary}
              />
            </View>

            <BottomSheetTextInput
              className="bg-muted p-4 rounded-xl text-base mb-4 text-foreground custom-font-regular"
              style={{ minHeight: 120, textAlignVertical: 'top' }}
              placeholder="What did you think of this book?"
              placeholderTextColor={Colors.mutedForeground}
              multiline
              value={postText}
              onChangeText={setPostText}
              maxLength={MAX_CHARS}
              autoCorrect={true}
              spellCheck={true}
            />
          </BottomSheetScrollView>
        )}

        {Platform.OS === 'web' && (
          <View className="mt-auto px-6 pb-8" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
            <Buttons
              title={isSubmitting ? "Posting..." : "Post Review"}
              onPress={handleSubmit}
              disabled={isSubmitting || isOverLimit || userRating === 0 || !selectedBook}
            />
          </View>
        )}
      </View>
    );

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: 'white' }}
        handleIndicatorStyle={{ backgroundColor: Colors.mutedForeground, opacity: 0.8 }}
        onDismiss={handleDismiss}
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
        enableDynamicSizing={false}
        footerComponent={Platform.OS === 'web' ? undefined : renderFooter}
      >
        {content}
      </BottomSheetModal>
    );
  }
);

CreateReviewModal.displayName = 'CreateReviewModal';
