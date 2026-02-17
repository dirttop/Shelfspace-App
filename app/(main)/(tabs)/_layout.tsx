import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute', 
          },
          default: {
            backgroundColor: 'white',
            elevation: 8,
          },
        }),
      }}>

      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name={focused ? 'home' : 'home-outline'} 
              size={28} 
              color={color} 
            />
          ),
        }}
      />

      <Tabs.Screen
        name="social"
        options={{
          title: 'Social',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name={focused ? 'account-group' : 'account-group-outline'} 
              size={28} 
              color={color} 
            />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons 
              name="magnify" 
              size={28} 
              color={color} 
            />
          ),
        }}
      />

      <Tabs.Screen
        name="club"
        options={{
          title: 'Club',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name={focused ? 'book-open-page-variant' : 'book-open-page-variant-outline'} 
              size={28} 
              color={color} 
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name={focused ? 'account' : 'account-outline'} 
              size={28} 
              color={color} 
            />
          ),
        }}
      />

    </Tabs>
  );
}