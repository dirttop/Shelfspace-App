/* eslint-disable @typescript-eslint/no-unused-vars */
import AppText from "@/components/common/AppText";
import Card from "@/components/common/Card";
import { supabase } from "@/app/lib/supabase";
import { Book } from "@/types/book";
import { useRouter } from "expo-router";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { View, ViewProps, Alert, TouchableOpacity } from "react-native";
import { EllipsisVertical, Trash2, Flag } from "lucide-react-native";
import BookItem from "../book/BookItem";
import UserHeader from "../common/UserHeader";
import { Rating } from '@kolking/react-native-rating';
import CardActions from "./CardActions";
import { Dropdown } from "@/components/button/Dropdown";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import CommentsModal from "../modals/CommentsModal";
import { Colors } from "@/constants/Colors";

interface ReviewProps extends ViewProps {
  firstName?: string;
  lastName?: string;
  username?: string;
  uriAvatar?: string;
  userRating?: number;
  book?: Book;
  postText?: string;
  postType?: "review" | "progress";
  progress?: number;
  
  userId?: string;
  postId?: number;
  currentUserId?: string;
  timestamp?: string;
  likesCount?: number;
  commentsCount?: number;
  onDelete?: () => void;
  isLiked?: boolean;
}

const ReviewCard = ({
  firstName = "",
  lastName = "",
  username = "",
  uriAvatar,
  userRating,
  className = "",
  children,
  book,
  postText,
  postType,
  progress,
  userId,
  postId,
  currentUserId,
  timestamp,
  likesCount = 0,
  commentsCount = 0,
  onDelete,
  isLiked: initialIsLiked = false,
  ...props
}: ReviewProps) => {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [localLikesCount, setLocalLikesCount] = useState(likesCount);
  const [localCommentsCount, setLocalCommentsCount] = useState(commentsCount);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownCoords, setDropdownCoords] = useState<{ top?: number; left?: number; width?: number }>({});
  const moreButtonRef = useRef<View>(null);
  const commentsModalRef = useRef<BottomSheetModal>(null);

  // Keep local counts in sync if parent refreshes
  useEffect(() => { setIsLiked(initialIsLiked); }, [initialIsLiked]);
  useEffect(() => { setLocalLikesCount(likesCount); }, [likesCount]);
  useEffect(() => { setLocalCommentsCount(commentsCount); }, [commentsCount]);

  // Removed redundant isLiked fetching - handled by useFeed batch query

  const isOwner = !!currentUserId && currentUserId === userId;

  const getTimeElapsed = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
  };

  const timeElapsed = getTimeElapsed(timestamp);

  const handleLikePress = async () => {
    if (!postId || !currentUserId) return;
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLocalLikesCount(prev => wasLiked ? Math.max(0, prev - 1) : prev + 1);

    if (wasLiked) {
      const { error } = await supabase.from('postLikes').delete().eq('postId', postId).eq('userId', currentUserId);
      if (error) { setIsLiked(wasLiked); setLocalLikesCount(prev => wasLiked ? prev + 1 : Math.max(0, prev - 1)); }
    } else {
      const { error } = await supabase.from('postLikes').insert({ postId, userId: currentUserId });
      if (error) { setIsLiked(wasLiked); setLocalLikesCount(prev => wasLiked ? prev + 1 : Math.max(0, prev - 1)); }
    }
  };

  const handleMorePress = () => {
    moreButtonRef.current?.measureInWindow((x, y, width, height) => {
      setDropdownCoords({ top: y + height + 4, left: x + width - 180, width: 180 });
      setDropdownVisible(true);
    });
  };

  const handleDelete = () => {
    setDropdownVisible(false);
    Alert.alert("Delete Post", "Are you sure? This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
          const { error } = await supabase.from("posts").delete().eq("id", postId);
          if (error) Alert.alert("Error", "Failed to delete post.");
          else onDelete?.();
        }},
    ]);
  };

  const dropdownItems = isOwner
    ? [{ label: "Delete Post", icon: <Trash2 size={16} color={Colors.destructive} />, onPress: handleDelete }]
    : [{ label: "Report Post", icon: <Flag size={16} color={Colors.mutedForeground} />, onPress: () => Alert.alert("Reported", "Thank you for your report.") }];

  const handleCommentAdded = useCallback(() => setLocalCommentsCount(prev => prev + 1), []);
  const handleCommentDeleted = useCallback(() => setLocalCommentsCount(prev => Math.max(0, prev - 1)), []);

  return (
    <Card className={`p-2 w-full ${className}`} {...props}>
      <View className="flex-col w-full">
        <View className="flex-row w-full mb-2">
          <View className="flex-1 pr-4 justify-start">
            <View className="flex-row items-center mt-2 mb-2 gap-x-1">
              <UserHeader 
                userId={userId}
                firstName={firstName} 

                lastName={lastName} 
                username={username} 
                uriAvatar={uriAvatar} 
                rightText={
                  postType === "review"
                    ? " finished reading"
                    : postType === "progress"
                    ? " is reading"
                    : undefined
                }
              />
            </View>

            {book && (
              <View className="mb-2 flex-row flex-wrap items-center">
                <AppText variant="subtitle" numberOfLines={2}>
                  {book.title}
                </AppText>
              </View>
            )}

            <View className="items-start mt-2 mb-2">
              <Rating 
                disabled={true}
                size={24}
                rating={userRating}
                spacing={1.5}
                baseColor={Colors.mutedForeground}
                fillColor={Colors.primary}
                touchColor={Colors.primary}
              />
            </View>
          </View>

          {book && (
            <View className="justify-start pt-1 pl-0.5 relative">
              <BookItem book={book} className="w-24 h-36" />
              {postType === "progress" && progress !== undefined && (
                <View 
                  className="absolute px-2 py-1 rounded-2xl shadow-sm z-10"
                  style={{ 
                    top: 12, 
                    left: -18, 
                    backgroundColor: Colors.secondary,
                    shadowColor: 'black',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 3
                  }}
                >
                  <AppText variant="caption" className="text-foreground">
                    {progress}%
                  </AppText>
                </View>
              )}
            </View>
          )}
        </View>
          
        {!!postText && (
          <AppText variant="collapsible" className="mb-2 mt-2" charLimit={250}>
            {postText}
          </AppText>
        )}
        <View className="flex-row items-center justify-between w-full mt-2">
          <CardActions
            isLiked={isLiked}
            likesCount={localLikesCount}
            commentsCount={localCommentsCount}
            onLikePress={handleLikePress}
            onCommentPress={() => commentsModalRef.current?.present()}
          />
          <View className="flex-row items-center gap-x-2 pr-2">
            {!!timeElapsed && (
              <AppText variant="caption" className="text-muted-foreground">{timeElapsed}</AppText>
            )}
            <TouchableOpacity
              ref={moreButtonRef}
              onPress={handleMorePress}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <EllipsisVertical size={18} color={Colors.mutedForeground} />
            </TouchableOpacity>
          </View>
        </View>

        {!!children && (
          <View className="mt-2 pt-1">
            {children}
          </View>
        )}
      </View>

      {dropdownVisible && (
        <Dropdown
          isVisible={dropdownVisible}
          onClose={() => setDropdownVisible(false)}
          position={dropdownCoords}
          items={dropdownItems}
        />
      )}

      <CommentsModal
        ref={commentsModalRef}
        postId={postId}
        currentUserId={currentUserId}
        onCommentAdded={handleCommentAdded}
        onCommentDeleted={handleCommentDeleted}
      />
    </Card>
  );
};

export default ReviewCard;