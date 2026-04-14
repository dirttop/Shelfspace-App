/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { forwardRef, useCallback, useMemo, useState, useEffect } from 'react';
import { View, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard, TouchableOpacity, Alert, TextInput } from 'react-native';
import { BottomSheetModal, BottomSheetFlatList, BottomSheetTextInput, BottomSheetBackdrop, BottomSheetFooter } from '@gorhom/bottom-sheet';
import { supabase } from '@/app/lib/supabase';
import AppText from '../common/AppText';
import UserHeader from '../common/UserHeader';
import { Send, Trash2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Comment {
  id: string;
  postId: number;
  userId: string;
  text: string;
  created_at: string;
  profiles: {
    username: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
  };
}

interface CommentsModalProps {
  postId?: number;
  currentUserId?: string;
  onCommentAdded?: () => void;
  onCommentDeleted?: () => void;
}

const CommentsModal = forwardRef<BottomSheetModal, CommentsModalProps>(({ postId, currentUserId, onCommentAdded, onCommentDeleted }, ref) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const snapPoints = useMemo(() => ['50%', '90%'], []);

  const fetchComments = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles!userId (
            username,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('postId', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId, fetchComments]);

  const handleDeleteComment = async (commentId: string) => {
    Alert.alert(
      "Delete Comment",
      "Are you sure you want to delete this comment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              console.log(`Attempting to delete comment with id: ${commentId} (type: ${typeof commentId}) and userId: ${currentUserId} (type: ${typeof currentUserId})`);
              const { error, count } = await supabase
                .from('comments')
                .delete({ count: 'exact' })
                .eq('id', commentId);

              if (error) throw error;
              console.log(`Delete response: Rows affected: ${count}`);

              fetchComments();
              if (onCommentDeleted) onCommentDeleted();
            } catch (error) {
              console.error('Error deleting comment:', error);
              Alert.alert('Error', 'Failed to delete comment');
            }
          },
        },
      ]
    );
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  const renderFooter = useCallback(
    (props: any) => (
      <BottomSheetFooter {...props} bottomInset={0}>
        <CommentInput
          postId={postId}
          currentUserId={currentUserId}
          fetchComments={fetchComments}
          onCommentAdded={onCommentAdded}
          insetsBottom={insets.bottom}
        />
      </BottomSheetFooter>
    ),
    [insets.bottom, postId, currentUserId, fetchComments, onCommentAdded]
  );

  const renderComment = ({ item }: { item: Comment }) => (
    <View className="mb-4 px-4">
      <View className="flex-row items-start gap-x-3">
        <UserHeader
          userId={item.userId}
          firstName={item.profiles?.first_name}
          lastName={item.profiles?.last_name}
          username={item.profiles?.username}
          uriAvatar={item.profiles?.avatar_url}
          onPress={() => {
            if (ref && 'current' in ref && ref.current) {
              ref.current.dismiss();
            }
          }}
        />
        <View className="flex-1 bg-slate-100 p-3 rounded-2xl relative">
          <AppText variant="body" className="text-slate-800">
            {item.text}
          </AppText>
          {item.userId === currentUserId && (
            <TouchableOpacity
              onPress={() => handleDeleteComment(item.id)}
              className="absolute top-2 right-2 p-1"
            >
              <Trash2 size={14} color="#ef4444" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <BottomSheetModal
      ref={ref}
      index={1}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
      footerComponent={renderFooter}
    >
      <View className="flex-1 bg-white">
        <View className="p-4 border-b border-slate-100 flex-row justify-between items-center">
          <AppText variant="title">Comments</AppText>
        </View>

        {loading && comments.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator color="#3b82f6" />
          </View>
        ) : (
          <BottomSheetFlatList
            className="flex-1"
            data={comments}
            keyExtractor={(item: Comment) => item.id}
            renderItem={renderComment}
            contentContainerStyle={{ paddingVertical: 16 }}
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center py-20">
                <AppText className="text-slate-400">No comments yet. Be the first to comment!</AppText>
              </View>
            }
          />
        )}
      </View>
    </BottomSheetModal>
  );
});

export default CommentsModal;

CommentsModal.displayName = 'CommentsModal';

const CommentInput = ({
  postId,
  currentUserId,
  fetchComments,
  onCommentAdded,
  insetsBottom
}: {
  postId?: number;
  currentUserId?: string;
  fetchComments: () => void;
  onCommentAdded?: () => void;
  insetsBottom: number;
}) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePostComment = async () => {
    if (!newComment.trim() || !postId || !currentUserId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          postId,
          userId: currentUserId,
          text: newComment.trim(),
        });

      if (error) throw error;

      setNewComment('');
      Keyboard.dismiss();
      fetchComments();
      if (onCommentAdded) onCommentAdded();
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View
      className="bg-white border-t border-slate-200 px-4 py-3"
      style={{ paddingBottom: Math.max(insetsBottom, 12) }}
    >
      <View className="flex-row items-center gap-x-2">
        {Platform.OS === 'web' ? (
          <TextInput
            className="flex-1 bg-slate-100 px-4 py-2.5 rounded-full text-slate-900"
            placeholder="Write a comment..."
            value={newComment}
            onChangeText={setNewComment}
            maxLength={2000}
            autoCorrect={true}
            spellCheck={true}
            multiline
          />
        ) : (
          <BottomSheetTextInput
            className="flex-1 bg-slate-100 px-4 py-2.5 rounded-full text-slate-900"
            placeholder="Write a comment..."
            value={newComment}
            onChangeText={setNewComment}
            maxLength={2000}
            autoCorrect={true}
            spellCheck={true}
            multiline
          />
        )}
        <TouchableOpacity
          onPress={handlePostComment}
          disabled={!newComment.trim() || isSubmitting}
          className={`p-2 rounded-full ${newComment.trim() ? 'bg-blue-500' : 'bg-slate-200'}`}
        >
          <Send size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
