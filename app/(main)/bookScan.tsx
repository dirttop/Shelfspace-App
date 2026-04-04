import AppText from '@/components/common/AppText';
import { Feather } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useRef, useState, useEffect } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useBookModal } from "@/contexts/BookModalContext";
import { useLazyQuery } from '@apollo/client';
import { SEARCH_BOOKS_QUERY } from '@/hooks/useBookSearch';

export default function BookScan() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAutoScanning, setIsAutoScanning] = useState(true);
  const [autoScanMessage, setAutoScanMessage] = useState("Looking for book...");
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);

  const { openBookModal } = useBookModal();
  const [searchBooks] = useLazyQuery(SEARCH_BOOKS_QUERY);

  const AZURE_FUNCTION_URL = process.env.EXPO_PUBLIC_VISION_API_URL || "https://cover-vision-api-cafxebaee4ahhxb4.canadacentral-01.azurewebsites.net/api/Cover_Process";

  const processImage = async (uri: string, silent = false) => {
    try {
      if (!silent) setIsProcessing(true);
      if (silent) setAutoScanMessage("Analyzing cover...");

      let filename = uri.split('/').pop() || `upload.${Date.now()}.jpg`;

      const formData = new FormData();
      // React Native requires this specific object structure to upload files via FormData
      formData.append('image', {
        uri: uri,
        name: filename,
        type: 'image/jpeg',
      } as any);

      const response = await fetch(AZURE_FUNCTION_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Server Error: ${response.status} - ${errText}`);
      }

      const data = await response.json();
      if (!data.metadata) {
        throw new Error("Invalid response from server: 'metadata' missing.");
      }

      console.log('Success! Metadata:', data.metadata);

      if (data.metadata.title || data.metadata.author) {
        const searchQuery = [data.metadata.title, data.metadata.author]
          .filter(Boolean)
          .join(' ');

        try {
          const result = await searchBooks({ variables: { query: searchQuery } });
          const books = result.data?.searchBooks || [];

          if (books.length > 0) {
            let validSource = 'Google Books';
            if (books[0].source === 'Cache' || books[0].source === 'Google Books' || books[0].source === 'Open Library') {
              validSource = books[0].source;
            }
            openBookModal({ ...books[0], source: validSource });
            if (silent) {
              setIsAutoScanning(false);
              setAutoScanMessage("Found book!");
            }
          } else {
            if (!silent) Alert.alert('Scan Result', 'Could not find a matching book in our database.');
            if (silent) setAutoScanMessage("No match in database. Keep aiming...");
          }
        } catch (searchErr) {
          console.error('Book Search Error:', searchErr);
          if (!silent) Alert.alert('Search Failed', 'Failed to retrieve book details from the database.');
          if (silent) setAutoScanMessage("Search failed. Retrying...");
        } finally {
          if (!silent) setIsProcessing(false);
        }
      } else {
        if (!silent) Alert.alert('Scan Result', 'Could not detect book details. Please try again.');
        if (!silent) setIsProcessing(false);
        if (silent) setAutoScanMessage("No book detected. Keep aiming...");
      }
    } catch (err) {
      if (!silent) console.error('Error processing image:', err);
      if (!silent) Alert.alert("Scan Failed", (err instanceof Error) ? err.message : "An unknown error occurred.");
      if (!silent) setIsProcessing(false);
      if (silent) setAutoScanMessage("No book detected. Keep aiming...");
    }
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isActive = true;
    let isCurrentlyScanning = false;

    const autoScanLoop = async () => {
      // If manually processing, pause auto scan
      if (!isAutoScanning || isProcessing || !cameraRef.current || isCurrentlyScanning) {
        if (isActive) timeoutId = setTimeout(autoScanLoop, 1500);
        return;
      }

      try {
        isCurrentlyScanning = true;
        if (isActive) setAutoScanMessage("Capturing frame...");
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.3,
          base64: false,
        });
        
        if (photo?.uri && isActive) {
          await processImage(photo.uri, true);
        }
      } catch (err) {
        // Suppress expected errors during silent scan (e.g. camera busy)
        if (isActive) {
          console.log('Auto scan capture bypassed/errored.');
          setAutoScanMessage("Looking for book...");
        }
      } finally {
        isCurrentlyScanning = false;
        if (isActive) {
          timeoutId = setTimeout(autoScanLoop, 2000); // Wait 2s before next shot
        }
      }
    };

    if (isAutoScanning) {
      timeoutId = setTimeout(autoScanLoop, 1000); // Start after 1s
    }

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, [isAutoScanning, isProcessing]);

  const handleCapture = async () => {
    if (!cameraRef.current || isProcessing) return;
    try {
      setIsProcessing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false, // Don't need base64 if we are uploading the file
      });
      if (photo?.uri) {
        await processImage(photo.uri);
      }
    } catch (error) {
      console.error('Failed to take picture:', error);
      setIsProcessing(false);
    }
  };

  const handleImagePicker = async () => {
    if (isProcessing) return;
    try {
      setIsProcessing(true);

      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission required',
          'Camera roll permission is required to select a photo.'
        );
        setIsProcessing(false);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // or true if you want users to crop the cover
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const image = result.assets[0];
        await processImage(image.uri);
      } else {
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Failed to pick image:', error);
      setIsProcessing(false);
    }
  };

  const handleBarcodeScanned = async (scanningResult: any) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // For barcode, the data is the ISBN, so we can search directly
      const result = await searchBooks({ variables: { query: scanningResult.data } });
      const books = result.data?.searchBooks || [];

      if (books.length > 0) {
        let validSource = 'Google Books';
        if (books[0].source === 'Cache' || books[0].source === 'Google Books' || books[0].source === 'Open Library') {
          validSource = books[0].source;
        }
        openBookModal({ ...books[0], source: validSource });
        setIsAutoScanning(false);
      } else {
        Alert.alert('Scan Result', 'Could not find a matching book for this barcode in our database.');
      }
    } catch (searchErr) {
      console.error('Barcode Search Error:', searchErr);
      Alert.alert('Search Failed', 'Failed to retrieve book details for this barcode.');
    } finally {
      // reset after short delay
      setTimeout(() => setIsProcessing(false), 2000);
    }
  };

  if (!permission) {
    return <View className="flex-1 bg-black" />; // Loading
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 flex-col items-center justify-center bg-black px-6 gap-y-4">
        <AppText variant="title" className="text-white text-center">Camera Permission needed</AppText>
        <AppText variant="body" className="text-gray-400 text-center">We need your permission to use the camera to scan book covers or ISBNs.</AppText>
        <TouchableOpacity onPress={requestPermission} className="bg-white/20 px-6 py-3 rounded-xl mt-4">
          <AppText variant="body" className="text-white font-bold">Grant Permission</AppText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'qr'],
        }}
        onBarcodeScanned={handleBarcodeScanned}
      >
        <View className={`flex-1 flex-col justify-between p-6 pb-12 pt-16 ${isProcessing ? 'bg-black/30' : ''}`}>
          {/* Header */}
          <View className="w-full flex-row" style={{ justifyContent: 'flex-start' }}>
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center"
            >
              <Feather name="x" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Scanning Overlay (Target Guide) */}
          <View className="flex-1 flex items-center justify-center" pointerEvents="none">
            {isProcessing ? (
              <View className="w-72 h-96 border-2 border-white/50 rounded-2xl flex items-center justify-center">
                <ActivityIndicator size="large" color="#ffffff" />
                <AppText variant="body" className="text-white mt-4 font-medium" style={{ color: 'white' }}>
                  Scanning book...
                </AppText>
              </View>
            ) : (
              <>
                <View className="w-72 h-96 border-2 border-white/50 rounded-2xl bg-white/10" />
                <AppText variant="body" className="text-white mt-6 bg-black/50 px-4 py-2 rounded-full font-medium" style={{ color: 'white' }}>
                  {isAutoScanning ? autoScanMessage : "Line up book cover or barcode"}
                </AppText>
              </>
            )}
          </View>

          {/* Controls */}
          <View className="flex-row items-center justify-center mb-10 w-full relative">
            {/* Gallery Button */}
            <TouchableOpacity
              onPress={handleImagePicker}
              disabled={isProcessing}
              className={`absolute left-4 w-12 h-12 rounded-full bg-black/40 flex items-center justify-center ${isProcessing ? 'opacity-50' : 'opacity-100'}`}
            >
              <Feather name="image" size={24} color="white" />
            </TouchableOpacity>

            {/* Shutter Button */}
            <TouchableOpacity
              onPress={handleCapture}
              disabled={isProcessing}
              className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center ${isProcessing ? 'opacity-50' : 'opacity-100'}`}
            >
              <View className="w-16 h-16 rounded-full bg-white transition-opacity" />
            </TouchableOpacity>

            {/* Auto-Scan Toggle */}
            <TouchableOpacity
              onPress={() => setIsAutoScanning(!isAutoScanning)}
              className="absolute right-4 w-12 h-12 rounded-full bg-black/40 flex items-center justify-center"
            >
              <Feather name="activity" size={24} color={isAutoScanning ? "#4ade80" : "white"} />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
}
