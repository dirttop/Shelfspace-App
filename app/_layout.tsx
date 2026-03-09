import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client';
import { Sono_400Regular, Sono_500Medium, Sono_600SemiBold, Sono_700Bold, useFonts } from '@expo-google-fonts/sono';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

SplashScreen.preventAutoHideAsync();

const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.EXPO_PUBLIC_GRAPHQL_API_URL || 'http://localhost:4000/graphql',
  }),
  cache: new InMemoryCache()
});

import { BookInfoModal } from '@/components/modals/BookInfoModal';
import { BookModalProvider, useBookModal } from '@/contexts/BookModalContext';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useRef } from 'react';

// Wrapper component to manage the modal strictly within the provider context
const GlobalBookModal = () => {
  const { selectedBook } = useBookModal();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (selectedBook) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [selectedBook]);

  return <BookInfoModal ref={bottomSheetModalRef} />;
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Sono_400Regular,
    Sono_500Medium,
    Sono_600SemiBold,
    Sono_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ApolloProvider client={client}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <BottomSheetModalProvider>
            <BookModalProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(main)" options={{ headerShown: false }} />
              </Stack>
              <GlobalBookModal />
            </BookModalProvider>
          </BottomSheetModalProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ApolloProvider>
  );
}