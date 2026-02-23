import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from "react-native-safe-area-context";
import 'react-native-url-polyfill/auto';
import "../global.css";

// Initialize Apollo Client
const client = new ApolloClient({
  uri: process.env.EXPO_PUBLIC_GRAPHQL_API_URL || 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
});

export default function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(main)" options={{ headerShown: false }} />
          </Stack>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ApolloProvider>
  );
}