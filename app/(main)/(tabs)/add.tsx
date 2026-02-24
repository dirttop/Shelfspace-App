import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AddBookModal from "../../../components/modals/AddBookModal";

export default function AddTab() {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white">
      {/* Floating Add Button */}
      <View
        className="absolute z-10"
        style={{
          right: 24,
          bottom: 60 + (insets.bottom || 0),
        }}
      >
        <TouchableOpacity
          className="bg-blue-600 rounded-full w-14 h-14 items-center justify-center shadow-lg"
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text className="text-white text-3xl leading-9">+</Text>
        </TouchableOpacity>
      </View>
      <AddBookModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onScan={async () => {
          setModalVisible(false);
          // Request permission
          const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== "granted") {
            Alert.alert(
              "Permission required",
              "Camera roll permission is required to select a photo.",
            );
            return;
          }
          // Launch image picker
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
          });
          if (!result.canceled && result.assets && result.assets.length > 0) {
            const imageUri = result.assets[0].uri;
            // TODO: handle the selected image (e.g., upload, scan, etc.)
            Alert.alert("Photo selected", imageUri);
          }
        }}
        onSearch={() => {
          setModalVisible(false);
          router.push("/search");
        }}
      />
    </View>
  );
}
