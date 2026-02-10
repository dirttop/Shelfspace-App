import ProfileCard from "@/components/card/ProfileCard";
import { View } from "react-native";

export default function Profile() {
  return (
    <View className="flex-1 items-center justify-center">
      <ProfileCard></ProfileCard>
    </View>
  );
}