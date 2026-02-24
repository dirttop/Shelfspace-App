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
        style={{
          position: "absolute",
          right: 24,
          bottom: 60 + (insets.bottom || 0),
          zIndex: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 4,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#2563eb",
            borderRadius: 28,
            width: 56,
            height: 56,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={{ color: "white", fontSize: 32, lineHeight: 36 }}>
            +
          </Text>
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
