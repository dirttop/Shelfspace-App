import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import * as ImagePicker from "expo-image-picker";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import { Alert, Platform } from "react-native";
import { AddBookModal } from "../../../components/modals/AddBookModal";

export default function TabLayout() {
  const addBookModalRef = React.useRef<BottomSheetModal>(null);
  const router = useRouter();

  // Handlers for AddBookModal actions
  const handleScan = async () => {
    addBookModalRef.current?.dismiss();
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Camera roll permission is required to select a photo.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      Alert.alert("Photo selected", imageUri);
    }
  };

  const handleSearch = () => {
    addBookModalRef.current?.dismiss();
    router.push("/search");
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#007AFF",
          tabBarInactiveTintColor: "#8E8E93",
          headerShown: false,
          tabBarStyle: Platform.select({
            ios: {
              position: "absolute",
            },
            default: {
              backgroundColor: "white",
              elevation: 8,
            },
          }),
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons
                name={focused ? "home" : "home-outline"}
                size={28}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="magnify" size={28} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="add"
          options={{
            title: "Add",
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons
                name={focused ? "book-plus" : "book-plus-outline"}
                size={28}
                color={color}
              />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              addBookModalRef.current?.present();
            },
          }}
        />

        <Tabs.Screen
          name="club"
          options={{
            title: "Club",
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons
                name={
                  focused
                    ? "book-open-page-variant"
                    : "book-open-page-variant-outline"
                }
                size={28}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons
                name={focused ? "account" : "account-outline"}
                size={28}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
      <AddBookModal
        ref={addBookModalRef}
        onScan={handleScan}
        onSearch={handleSearch}
      />
    </>
  );
}
