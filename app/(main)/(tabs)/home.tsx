import AppText from "@/components/common/AppText";
import { View } from "react-native";

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center">
      <AppText variant="title" className="text-blue-500">Home</AppText>
    </View>
  );
}