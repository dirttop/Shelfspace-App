import { Feather } from "@expo/vector-icons";
import { useRouter, withLayoutContext } from "expo-router";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";

const TopTabs = withLayoutContext(createMaterialTopTabNavigator().Navigator);

export default function TabLayout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <>
      <TopTabs
        tabBarPosition="bottom"
        screenOptions={{
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: "#8E8E93",
          tabBarShowIcon: true,
          tabBarShowLabel: false,
          tabBarIndicatorStyle: {
            backgroundColor: Colors.primary,
            top: 0,
          },
          tabBarStyle: Platform.select({
            ios: {
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              paddingBottom: insets.bottom,
              height: 55 + insets.bottom,
              backgroundColor: Colors.background,
            },
            default: {
              backgroundColor: "white",
              elevation: 8,
              paddingBottom: insets.bottom,
              height: 55 + insets.bottom,
            },
          }),
        }}
      >
        <TopTabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
              <Feather
                name="home"
                size={28}
                color={color}
              />
            ),
          }}
        />

        <TopTabs.Screen
          name="search"
          options={{
            tabBarIcon: ({ color }: { color: string }) => (
              <Feather name="search" size={28} color={color} />
            ),
          }}
        />

        <TopTabs.Screen
          name="add"
          options={{
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
              <Feather
                name="plus-circle"
                size={28}
                color={color}
              />
            ),
          }}
        />

        <TopTabs.Screen
          name="club"
          options={{
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
              <Feather
                name="users"
                size={28}
                color={color}
              />
            ),
          }}
        />

        <TopTabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
              <Feather
                name="user"
                size={28}
                color={color}
              />
            ),
          }}
        />
      </TopTabs>
    </>
  );
}
