import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView, BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { View, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Alert, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import AppText from '../common/AppText';
import Buttons from '../common/Buttons';
import { supabase } from '@/app/lib/supabase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { X, Image as ImageIcon, ChevronDown, Keyboard as KeyboardIcon } from 'lucide-react-native';
// Replaced above

export type CreatePostModalProps = {
  onPostCreated?: () => void;
};

export const CreatePostModal = forwardRef<BottomSheetModal, CreatePostModalProps>(
  (props, ref) => {
    const [postText, setPostText] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const insets = useSafeAreaInsets();

    const MAX_CHARS = 500;
    const charsRemaining = MAX_CHARS - postText.length;
    const isOverLimit = charsRemaining < 0;
    const counterColor = isOverLimit
      ? '#ef4444'   // red
      : charsRemaining <= 25
      ? '#f97316'   // orange
      : charsRemaining <= 100
      ? '#eab308'   // yellow
      : '#a1a1aa';  // default gray

    const snapPoints = useMemo(() => ['50%', '90%'], []);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.3}
          pressBehavior="close"
        />
      ),
      []
    );

    // Only dismiss keyboard on swipe-away — preserve draft content
    const handleDismiss = useCallback(() => {
      Keyboard.dismiss();
    }, []);

    // Called only on successful post or explicit close
    const clearDraft = useCallback(() => {
      setPostText('');
      setImageUri(null);
    }, []);

    const pickImage = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    };

    const handleSubmit = async () => {
      if (!postText.trim()) return;
      
      setIsSubmitting(true);
      try {
        const { data: userData, error: userErr } = await supabase.auth.getUser();
        if (userErr || !userData.user) {
          throw new Error('You must be logged in to post.');
        }

        let fileUrl = null;
        if (imageUri) {
          const extMatch = imageUri.match(/\.(\w+)(?:\?|$)/);
          const fileExt = extMatch ? extMatch[1].toLowerCase() : 'jpeg';
          const mimeType = fileExt === 'png' ? 'image/png' : fileExt === 'gif' ? 'image/gif' : fileExt === 'webp' ? 'image/webp' : 'image/jpeg';
          const filePath = `${userData.user.id}/${Date.now()}.${fileExt}`;

          // Read file as base64 via expo-file-system (React Native blob can't be read by Supabase JS)
          const base64 = await FileSystem.readAsStringAsync(imageUri, {
            encoding: 'base64',
          });
          const binaryStr = atob(base64);
          const bytes = new Uint8Array(binaryStr.length);
          for (let i = 0; i < binaryStr.length; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
          }

          const { error: uploadError } = await supabase.storage.from('posts').upload(filePath, bytes, {
            contentType: mimeType,
            cacheControl: '3600',
            upsert: false,
          });
          if (uploadError) throw new Error('Failed to upload image: ' + uploadError.message);
          
          const { data } = supabase.storage.from('posts').getPublicUrl(filePath);
          fileUrl = data.publicUrl;
        }

        const { error: insertErr } = await supabase
          .from('posts')
          .insert({
            userId: userData.user.id,
            body: postText,
            file: fileUrl,
            post_type: 'post',
            book_isbn: null,
          });

        if (insertErr) throw insertErr;
        
        // Clear text and dismiss modal
        setPostText('');
        setImageUri(null);
        if (ref && 'current' in ref && ref.current) {
          ref.current.dismiss();
        }
        
        if (props.onPostCreated) {
          props.onPostCreated();
        }
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Failed to create post');
      } finally {
        setIsSubmitting(false);
      }
    };

    const content = (
      <BottomSheetView style={{ flex: 1, backgroundColor: 'white' }} className="px-6 pt-2 pb-8 flex-1">
        {/* Header row: title, char counter, keyboard-dismiss button */}
        <View className="flex-row items-center justify-between mb-4">
          <AppText variant="title">Create a Post</AppText>
          <View className="flex-row items-center gap-3">
            <AppText
              variant="caption"
              style={{ color: counterColor, fontVariant: ['tabular-nums'], minWidth: 30, textAlign: 'right' }}
            >
              {charsRemaining}
            </AppText>
            <TouchableOpacity
              onPress={Keyboard.dismiss}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              className="bg-slate-100 rounded-full p-1.5 flex-row items-center gap-1"
            >
              <KeyboardIcon size={14} color="#64748b" />
              <ChevronDown size={14} color="#64748b" />
            </TouchableOpacity>
          </View>
        </View>

        {Platform.OS === 'web' ? (
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
          >
            <TextInput
              className="bg-muted p-4 rounded-xl text-base mb-4 text-foreground custom-font-regular"
              style={{
                minHeight: 120,
                textAlignVertical: 'top'
              }}
              placeholder="What are your thoughts?"
              placeholderTextColor="#A1A1AA"
              multiline
              value={postText}
              onChangeText={(text) => {
                if (text.length <= MAX_CHARS + 50) setPostText(text);
              }}
            />
            {imageUri && (
              <View className="mb-4 relative">
                <Image source={{ uri: imageUri }} className="w-full h-48 rounded-xl" resizeMode="cover" />
                <TouchableOpacity 
                  className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full"
                  onPress={() => setImageUri(null)}
                >
                  <X size={16} color="white" />
                </TouchableOpacity>
              </View>
            )}
            
            <View className="flex-row items-center gap-4 mb-4">
              <TouchableOpacity onPress={pickImage} className="flex-row items-center gap-2 p-2 bg-slate-100 rounded-lg">
                <ImageIcon size={20} color="#64748b" />
                <AppText variant="caption" className="text-slate-600">Attach Image</AppText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : (
          <BottomSheetScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
          >
            <BottomSheetTextInput
              className="bg-muted p-4 rounded-xl text-base mb-4 text-foreground custom-font-regular"
              style={{
                minHeight: 120,
                textAlignVertical: 'top'
              }}
              placeholder="What are your thoughts?"
              placeholderTextColor="#A1A1AA"
              multiline
              value={postText}
              onChangeText={(text) => {
                if (text.length <= MAX_CHARS + 50) setPostText(text);
              }}
            />
            {imageUri && (
              <View className="mb-4 relative">
                <Image source={{ uri: imageUri }} className="w-full h-48 rounded-xl" resizeMode="cover" />
                <TouchableOpacity 
                  className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full"
                  onPress={() => setImageUri(null)}
                >
                  <X size={16} color="white" />
                </TouchableOpacity>
              </View>
            )}
            
            <View className="flex-row items-center gap-4 mb-4">
              <TouchableOpacity onPress={pickImage} className="flex-row items-center gap-2 p-2 bg-slate-100 rounded-lg">
                <ImageIcon size={20} color="#64748b" />
                <AppText variant="caption" className="text-slate-600">Attach Image</AppText>
              </TouchableOpacity>
            </View>
          </BottomSheetScrollView>
        )}

        <View className="mt-auto" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
          <Buttons
            title={isSubmitting ? "Posting..." : "Post"}
            onPress={handleSubmit}
            disabled={!postText.trim() || isSubmitting || isOverLimit}
          />
        </View>
      </BottomSheetView>
    );

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: 'white' }}
        handleIndicatorStyle={{ backgroundColor: '#A1A1AA', opacity: 0.8 }}
        onDismiss={handleDismiss}
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
      >
        {Platform.OS === 'web' ? (
          content
        ) : (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {content}
          </TouchableWithoutFeedback>
        )}
      </BottomSheetModal>
    );
  }
);
