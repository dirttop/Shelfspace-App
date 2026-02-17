import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="edit-profile" />
    </Stack>
  );
}