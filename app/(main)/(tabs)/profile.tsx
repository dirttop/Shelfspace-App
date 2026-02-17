import ProfileCard from "@/components/card/ProfileCard";
import React, { useCallback } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function Profile() {
  const insets = useSafeAreaInsets();

  const ProfileHeader = useCallback(() => (
    <View className="px-4 pt-2 pb-4 bg-white">
      <ProfileCard
        fullName="John Smith"
        username="johnsmith418"
        bio="This is a mock bio. I will now type to make it longer to test the wrapping. I will now type to make it longer to test the wrapping."
        readCount={42}
        readingCount={3}
        shelvedCount={17}
      />
    </View>
  ), []);

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
        <ProfileHeader></ProfileHeader>
    </View>
  );
}