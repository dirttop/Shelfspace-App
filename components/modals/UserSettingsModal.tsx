/* eslint-disable @typescript-eslint/no-empty-object-type */
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView, useBottomSheetModal } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { supabase } from '../../app/lib/supabase';
import AppText from '../common/AppText';

export type UserSettingsModalProps = {
  // We no longer need isVisible/onClose props since BottomSheet uses Refs
};

export const UserSettingsModal = forwardRef<BottomSheetModal, UserSettingsModalProps>(
  (props, ref) => {
    const { dismiss } = useBottomSheetModal();
    // variables
    const snapPoints = useMemo(() => ['25%', '50%'], []);

    const handleSignOut = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert('Error signing out', error.message);
      } else {
        dismiss();
        router.replace('/(auth)/login');
      }
    };

    // callbacks
    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.3}
        />
      ),
      []
    );

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: 'var(--background)' }}
        handleIndicatorStyle={{ backgroundColor: 'var(--muted-foreground)', opacity: 0.3 }}
      >
        <BottomSheetView className="flex-1 px-6 pt-2 pb-8">
          <AppText variant="title" className="mb-6">
            Settings
          </AppText>

          <View className="gap-y-3">
            <View className="bg-muted p-4 rounded-2xl flex-row items-center justify-between">
              <AppText variant="body" className="text-foreground">
                Appearance
              </AppText>
            </View>
            <View className="bg-muted p-4 rounded-2xl flex-row items-center justify-between">
              <AppText variant="body" className="text-foreground">
                Account settings
              </AppText>
            </View>
            <Pressable onPress={handleSignOut} className="bg-muted p-4 rounded-2xl flex-row items-center justify-between">
              <AppText variant="body" className="text-foreground">
                Sign Out
              </AppText>
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

UserSettingsModal.displayName = 'UserSettingsModal';
