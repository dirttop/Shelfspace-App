import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen 
        name="home"
        options={{ title: "Home" }} 
      />
      <Tabs.Screen 
        name="social" 
        options={{ title: "Social" }} 
      />
      <Tabs.Screen 
        name="search" 
        options={{ title: "Search" }} 
      />
      <Tabs.Screen 
        name="club" 
        options={{ title: "Club" }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ title: "Profile" }} 
      />
    </Tabs>
  );
}