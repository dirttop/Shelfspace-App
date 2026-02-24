import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import AppText from '../common/AppText';

export type UserSettingsModalProps = {
  // We no longer need isVisible/onClose props since BottomSheet uses Refs
};

export const UserSettingsModal = forwardRef<BottomSheetModal, UserSettingsModalProps>(
  (props, ref) => {
    // variables
    const snapPoints = useMemo(() => ['25%', '50%'], []);

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
              <AppText variant="body" className="font-medium text-foreground">
                Appearance
              </AppText>
            </View>
            <View className="bg-muted p-4 rounded-2xl flex-row items-center justify-between">
              <AppText variant="body" className="font-medium text-foreground">
                Account settings
              </AppText>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);
