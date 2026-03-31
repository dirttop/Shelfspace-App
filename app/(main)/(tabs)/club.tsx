import AppText from "@/components/common/AppText";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center">
      <AppText variant="title" >Under Construction</AppText>
      <Feather name="package" size={28} color="#73BDA8" />
    </View>
  );
}