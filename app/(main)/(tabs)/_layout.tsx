import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { AddBookModal } from "../../../components/modals/AddBookModal";

export default function TabLayout() {
  const addBookModalRef = React.useRef<BottomSheetModal>(null);
  const router = useRouter();

  // Handlers for AddBookModal actions
  const handleScan = () => {
    addBookModalRef.current?.dismiss();
    router.push("/bookScan");
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
