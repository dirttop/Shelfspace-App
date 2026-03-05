import AppText from '@/components/common/AppText';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function BookScan() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);

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

  const handleCapture = async () => {
    if (!cameraRef.current || isProcessing) return;
    try {
      setIsProcessing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });
      // TODO: Call AI/OCR API with photo.uri or photo.base64
      console.log('Took photo:', photo?.uri);

      // Navigate or show processing state
    } catch (error) {
      console.error('Failed to take picture:', error);
    } finally {
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
        allowsEditing: false,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const image = result.assets[0];
        // TODO: Call AI/OCR API with image.uri or image.base64
        console.log('Selected photo from gallery:', image.uri);
      }
    } catch (error) {
      console.error('Failed to pick image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBarcodeScanned = (scanningResult: any) => {
    if (isProcessing) return;
    setIsProcessing(true);
    // TODO: Look up book by ISBN (data)
    console.log('Scanned barcode:', scanningResult.type, scanningResult.data);

    // reset after short delay or navigate
    setTimeout(() => setIsProcessing(false), 2000);
  };

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
        <View className="flex-1 flex-col justify-between p-6 pb-12 pt-16">
          {/* Header */}
          <View className="w-full flex-row" style={{ justifyContent: 'flex-start' }}>
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center"
            >
              <MaterialCommunityIcons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Scanning Overlay (Target Guide) */}
          <View className="flex-1 flex items-center justify-center" pointerEvents="none">
            <View className="w-64 h-80 border-2 border-white/50 rounded-2xl bg-white/10" />
            <AppText variant="body" className="text-white mt-6 bg-black/50 px-4 py-2 rounded-full font-medium">
              Line up book cover or barcode
            </AppText>
          </View>

          {/* Controls */}
          <View className="flex-row items-center justify-center mb-10 w-full relative">
            {/* Gallery Button */}
            <TouchableOpacity
              onPress={handleImagePicker}
              disabled={isProcessing}
              className={`absolute left-4 w-12 h-12 rounded-full bg-black/40 flex items-center justify-center ${isProcessing ? 'opacity-50' : 'opacity-100'}`}
            >
              <MaterialCommunityIcons name="image-multiple" size={24} color="white" />
            </TouchableOpacity>

            {/* Shutter Button */}
            <TouchableOpacity
              onPress={handleCapture}
              disabled={isProcessing}
              className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center ${isProcessing ? 'opacity-50' : 'opacity-100'}`}
            >
              <View className="w-16 h-16 rounded-full bg-white transition-opacity" />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
}
