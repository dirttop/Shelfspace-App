import AppText from "@/components/common/AppText";
import Card from "@/components/common/Card";
import { useRouter } from "expo-router";
import React from "react";
import { View, ViewProps, Image } from "react-native";
import UserHeader from "../common/UserHeader";
import CardActions from "./CardActions";

interface ReviewProps extends ViewProps {
  firstName?: string;
  lastName?: string;
  username?: string;
  uriAvatar?: string;
  postText?: string;
  postImage?: string;
  userId?: string;
  timestamp?: string;
  likesCount?: number;
  commentsCount?: number;
}

const PostCard = ({
  firstName = "",
  lastName = "",
  username = "",
  uriAvatar,
  className = "",
  children,
  postText,
  postImage,
  userId,
  timestamp,
  likesCount = 0,
  commentsCount = 0,
  ...props
}: ReviewProps) => {
  const router = useRouter();
  const [isLiked, setIsLiked] = React.useState(false);

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
    return Math.floor(seconds) + "s ago"; // Fallback to seconds
  };
  
  const timeElapsed = getTimeElapsed(timestamp);

  return (
    <Card className={`p-2 w-full ${className}`} {...props}>
      <View className="flex-col w-full">
        <View className="flex-row w-full mb-2">
          <View className="flex-1 flex-row items-center justify-between">
            <View className="flex-row items-center mt-2 mb-2 gap-x-2">
              <UserHeader 
                userId={userId}
                firstName={firstName} 
                lastName={lastName} 
                username={username} 
                uriAvatar={uriAvatar} 
              />
            </View>
            {!!timeElapsed && (
              <AppText variant="caption" className="text-slate-400 text-right">{timeElapsed}</AppText>
            )}
          </View>
        </View>
          
        {!!postText && (
          <AppText variant="collapsible" className="mb-2 mt-2">
            {postText}
          </AppText>
        )}

        {!!postImage && (
          <Image 
            source={{ uri: postImage }} 
            className="w-full h-64 rounded-xl mb-4" 
            resizeMode="cover" 
          />
        )}

        <CardActions 
          isLiked={isLiked}
          likesCount={likesCount}
          commentsCount={commentsCount}
          onLikePress={() => setIsLiked(!isLiked)}
        />

        {!!children && (
          <View className="mt-2 pt-1">
            {children}
          </View>
        )}
      </View>
    </Card>
  );
};

export default PostCard;