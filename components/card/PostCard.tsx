import AppText from "@/components/common/AppText";
import Card from "@/components/common/Card";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { View, ViewProps, Alert, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { EllipsisVertical, Trash2, Flag } from "lucide-react-native";
import UserHeader from "../common/UserHeader";
import CardActions from "./CardActions";
import { Dropdown } from "@/components/button/Dropdown";

interface ReviewProps extends ViewProps {
  firstName?: string;
  lastName?: string;
  username?: string;
  uriAvatar?: string;
  postText?: string;
  postImage?: string;
  userId?: string;
  postId?: number;
  currentUserId?: string;
  timestamp?: string;
  likesCount?: number;
  commentsCount?: number;
  onDelete?: () => void;
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
  postId,
  currentUserId,
  timestamp,
  likesCount = 0,
  commentsCount = 0,
  onDelete,
  ...props
}: ReviewProps) => {
  const router = useRouter();
  const [isLiked, setIsLiked] = React.useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownCoords, setDropdownCoords] = useState<{ top?: number; left?: number; width?: number }>({});
  const moreButtonRef = useRef<View>(null);

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

  const handleMorePress = () => {
    moreButtonRef.current?.measureInWindow((x, y, width, height) => {
      setDropdownCoords({
        top: y + height + 4,
        left: x + width - 180, // right-align the 180px-wide dropdown
        width: 180,
      });
      setDropdownVisible(true);
    });
  };

  const handleDelete = () => {
    setDropdownVisible(false);
    Alert.alert(
      "Delete Post",
      "Are you sure? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase.from("posts").delete().eq("id", postId);
            if (error) {
              Alert.alert("Error", "Failed to delete post.");
            } else {
              onDelete?.();
            }
          },
        },
      ]
    );
  };

  const dropdownItems = isOwner
    ? [
        {
          label: "Delete Post",
          icon: <Trash2 size={16} color="#ef4444" />,
          onPress: handleDelete,
        },
      ]
    : [
        {
          label: "Report Post",
          icon: <Flag size={16} color="#64748b" />,
          onPress: () => Alert.alert("Reported", "Thank you for your report."),
        },
      ];

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
            <View className="flex-row items-center gap-x-2">
              {!!timeElapsed && (
                <AppText variant="caption" className="text-slate-400">{timeElapsed}</AppText>
              )}
              <TouchableOpacity
                ref={moreButtonRef}
                onPress={handleMorePress}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <EllipsisVertical size={18} color="#94a3b8" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
          
        {!!postText && (
          <AppText variant="collapsible" className="mb-2 mt-2">
            {postText}
          </AppText>
        )}

        {!!postImage && (
          <Image
            source={postImage}
            style={{ width: '100%', height: 256, borderRadius: 12, marginBottom: 16 }}
            contentFit="cover"
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

      {dropdownVisible && (
        <Dropdown
          isVisible={dropdownVisible}
          onClose={() => setDropdownVisible(false)}
          position={dropdownCoords}
          items={dropdownItems}
        />
      )}
    </Card>
  );
};

export default PostCard;