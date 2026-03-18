import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { View, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Alert, Image, TouchableOpacity } from 'react-native';
import AppText from '../common/AppText';
import Buttons from '../common/Buttons';
import { supabase } from '@/app/lib/supabase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { X, Image as ImageIcon } from 'lucide-react-native';
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

    const handleDismiss = useCallback(() => {
      setPostText('');
      setImageUri(null);
      Keyboard.dismiss();
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
          const fileExt = imageUri.split('.').pop() || 'jpeg';
          const filePath = `${userData.user.id}/${Date.now()}.${fileExt}`;
          
          const res = await fetch(imageUri);
          const blob = await res.blob();
          
          const { error: uploadError } = await supabase.storage.from('posts').upload(filePath, blob);
          if (uploadError) throw new Error('Failed to upload image: ' + uploadError.message);
          
          const { data } = supabase.storage.from('posts').getPublicUrl(filePath);
          fileUrl = data.publicUrl;
        }

        // Insert into posts table
        const { error: insertErr } = await supabase
          .from('posts')
          .insert({
            userId: userData.user.id,
            body: postText,
            file: fileUrl,
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <BottomSheetView style={{ flex: 1, backgroundColor: 'white' }} className="px-6 pt-2 pb-8 flex-1">
            <AppText variant="title" className="mb-4">
              Create a Post
            </AppText>

            <View className="flex-1">
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
                onChangeText={setPostText}
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

              {/* Future Book Selection area */}
              <View className="bg-slate-50 p-4 rounded-xl border border-slate-200 border-dashed mb-4 items-center justify-center">
                <AppText variant="caption" className="text-slate-500">
                  + Associate a Book (Coming Soon)
                </AppText>
              </View>
            </View>

            <View className="mt-auto" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
              <Buttons
                title={isSubmitting ? "Posting..." : "Post"}
                onPress={handleSubmit}
                disabled={!postText.trim() || isSubmitting}
              />
            </View>
          </BottomSheetView>
        </TouchableWithoutFeedback>
      </BottomSheetModal>
    );
  }
);
