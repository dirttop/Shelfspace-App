import ProfileCard from "@/components/card/ProfileCard";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Profile() {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView
        contentContainerClassName="flex-grow  p-5"
        contentContainerStyle={{
          paddingBottom: 20 + insets.bottom, //easier to read than inline
          paddingTop: insets.top,
        }}
        className="flex-1"
      >
        <View>
          <ProfileCard></ProfileCard>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}