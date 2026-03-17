import IconButton from "@/components/button/IconButton";
import AppText from "@/components/common/AppText";
import Buttons from "@/components/common/Buttons";
import Card from "@/components/common/Card";
import { UserSettingsModal } from "@/components/modals/UserSettingsModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import React, { useCallback, useRef } from "react";
import { View, ViewProps } from "react-native";
import Avatar from "../common/Avatar";

interface ProfileProps extends ViewProps {
  firstName?: string;
  lastName?: string;
  username?: string;
  bio?: string;
  uriAvatar?: string;
  readCount?: number;
  readingCount?: number;
  shelvedCount?: number;
  postCount?: number;
  friendCount?: number;
  followCount?: number;
  isOwner?: boolean;
}

const ShelfStat = ({ label, value }: { label: string; value: number }) => (
  <View className="items-center">
    <AppText className="text-lg font-bold text-slate-900">{value}</AppText>
    <AppText className="text-xs text-slate-500">{label}</AppText>
  </View>
);

const SocialStat = ({ label, value }: { label: string; value: number }) => (
  <View className="items-center">
    <AppText className="text-lg font-bold text-slate-900">
      {value} {label}
    </AppText>
  </View>
);

const ProfileCard = ({
  firstName = "",
  lastName = "",
  username = "",
  bio = "Insert bio here",
  uriAvatar,
  readCount = 0,
  readingCount = 0,
  shelvedCount = 0,
  postCount = 0,
  friendCount = 0,
  followCount = 0,
  isOwner = true,
  className = "",
  ...props
}: ProfileProps) => {
  const router = useRouter();
  
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <Card className={className} {...props}>
      <View className={"flex-row items-center mb-6"}>
        <View className="pr-6">
          <Avatar uri={uriAvatar} name={firstName + " " + lastName} size="xl" />
        </View>

        <View className="flex-1 gap-y-.5 mt-2">
          <AppText variant="subtitle" className="text-slate-900">
            {firstName + " " + lastName}
          </AppText>
          <AppText variant="body" className="text-slate-500 mb-2">@{username}</AppText>
          <View className="flex-1 flex-row justify-around">
            <ShelfStat label="Reading" value={readingCount} />
            <ShelfStat label="Read" value={readCount} />
            <ShelfStat label="Followers" value={followCount} />
          </View>
        </View>
      </View>

      <View className="mb-4 p-2">
        {bio && (
          <AppText variant="caption" className="text-slate-700 leading-5">{bio}</AppText>
        )}
      </View>
      {isOwner && (
        <View className="flex-row gap-x-3 justify-between items-center">
          <View className="flex-1">
            <Buttons
              title="Edit Profile"
              size="sm"
              className="mb-0"
              onPress={() => router.push("/(main)/editProfile")}
            />
          </View>
          <View className="flex-row justify-end items-center mr-2">
            <IconButton 
              icon="gearOutline"
              pressedIcon="gearFill"
              onPress={handlePresentModalPress}
              size="md"
            />
            <UserSettingsModal
              ref={bottomSheetModalRef}
            />
          </View>
        </View>
      )}
    </Card>
  );
};

export default ProfileCard;
