import AppText from "@/components/common/AppText";
import { View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center">
      <AppText variant="title" className="text-blue-500">Club</AppText>
    </View>
  );
}