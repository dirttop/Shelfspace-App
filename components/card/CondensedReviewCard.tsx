import AppText from "@/components/common/AppText";
import Card from "@/components/common/Card";
import React from "react";
import { View, ViewProps } from "react-native";
import UserHeader from "../common/UserHeader";
import { Rating } from '@kolking/react-native-rating';
import { Heart } from "lucide-react-native";

interface CondensedReviewProps extends ViewProps {
  firstName?: string;
  lastName?: string;
  username?: string;
  uriAvatar?: string;
  userRating?: number;
  postText?: string;
  timestamp?: string;
  likesCount?: number;
  userId?: string;
  onPressProfile?: () => void;
}

const CondensedReviewCard = ({
  firstName = "",
  lastName = "",
  username = "",
  uriAvatar,
  userRating,
  postText,
  timestamp,
  likesCount = 0,
  userId,
  onPressProfile,
  className = "",
  ...props
}: CondensedReviewProps) => {

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

  return (
    <Card className={`p-4 w-full border border-slate-100 ${className}`} {...props}>
      <View className="flex-col w-full">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center pr-4 flex-1">
            <UserHeader 
              userId={userId}
              firstName={firstName} 
              lastName={lastName} 
              username={username} 
              uriAvatar={uriAvatar}
              rightText=""
              onPress={onPressProfile}
            />
          </View>
          <View className="items-end pl-2">
            <Rating 
              disabled={true}
              size={12}
              rating={userRating}
              spacing={1.5}
              baseColor="#71717a"
              fillColor="#73BDA8"
              touchColor="#73BDA8"
            />
          </View>
        </View>

        {!!postText && (
          <AppText className="text-[13px] text-slate-700 mt-2 mb-2 leading-5" numberOfLines={3}>
            {postText}
          </AppText>
        )}

        <View className="flex-row items-center justify-between mt-1">
          <View className="flex-row items-center gap-x-1">
            <Heart size={14} color="#FF2D55" fill={likesCount > 0 ? "#FF2D55" : "transparent"} />
            <AppText variant="caption" className="font-fraunces-bold text-slate-500">
              {likesCount}
            </AppText>
          </View>
          {!!timeElapsed && (
            <AppText variant="caption" className="text-slate-400">
              {timeElapsed}
            </AppText>
          )}
        </View>
      </View>
    </Card>
  );
};

export default CondensedReviewCard;
