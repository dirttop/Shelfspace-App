import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client';
import { DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold, DMSans_700Bold, useFonts as useDMSansFonts } from '@expo-google-fonts/dm-sans';
import { Fraunces_600SemiBold, Fraunces_700Bold, useFonts as useFrauncesFonts } from '@expo-google-fonts/fraunces';
import { BottomSheetModalProvider, BottomSheetModal } from '@gorhom/bottom-sheet';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

import Constants from 'expo-constants';
import { Platform, View } from 'react-native';

import { BookInfoModal } from '@/components/modals/BookInfoModal';
import { BookModalProvider, useBookModal } from '@/contexts/BookModalContext';

SplashScreen.preventAutoHideAsync();

let apiUrl = process.env.EXPO_PUBLIC_GRAPHQL_API_URL;

if (!apiUrl) {
  const debuggerHost = Constants.expoConfig?.hostUri;
  let host = debuggerHost?.split(':')[0];

  // If there's no host, or the host is localhost/127.0.0.1, we must use 10.0.2.2 on Android
  if (!host || host === 'localhost' || host === '127.0.0.1') {
    host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  }

  apiUrl = `http://${host}:4000/graphql`;
}

const client = new ApolloClient({
  link: new HttpLink({
    uri: apiUrl,
  }),
  cache: new InMemoryCache()
});

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useRouter, useSegments } from 'expo-router';
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

import { ActivityIndicator } from 'react-native';

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#000" />
    </View>
  );
}

function RootLayoutNav() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      // Redirect to the sign-in page if not authenticated
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      // Redirect to the main app if authenticated
      router.replace('/(main)/(tabs)/home');
    }
  }, [session, loading, segments]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(main)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [dmSansLoaded, dmSansError] = useDMSansFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });

  const [frauncesLoaded, frauncesError] = useFrauncesFonts({
    Fraunces_600SemiBold,
    Fraunces_700Bold,
  });

  const loaded = dmSansLoaded && frauncesLoaded;
  const error = dmSansError || frauncesError;

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
      <AuthProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <BottomSheetModalProvider>
              <BookModalProvider>
                <RootLayoutNav />
                <GlobalBookModal />
              </BookModalProvider>
            </BottomSheetModalProvider>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </AuthProvider>
    </ApolloProvider>
  );
}