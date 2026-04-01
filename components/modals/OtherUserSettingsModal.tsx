import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView, useBottomSheetModal } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { Alert, Pressable, View } from 'react-native';
import AppText from '../common/AppText';

export type OtherUserSettingsModalProps = {};

export const OtherUserSettingsModal = forwardRef<BottomSheetModal, OtherUserSettingsModalProps>(
  (props, ref) => {
    const { dismiss } = useBottomSheetModal();
    const snapPoints = useMemo(() => ['25%'], []);

    const handleBlock = () => {
      Alert.alert('Under Construction', 'Block user functionality coming soon.');
    };

    const handleReport = () => {
      Alert.alert('Under Construction', 'Report user functionality coming soon.');
    };

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

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: 'white' }}
        handleIndicatorStyle={{ backgroundColor: '#A1A1AA', opacity: 0.3 }}
      >
        <BottomSheetView className="flex-1 px-6 pt-2 pb-8">
          <AppText variant="title" className="mb-6">
            Options
          </AppText>

          <View className="gap-y-3">
            <Pressable onPress={handleReport} className="bg-slate-100 p-4 rounded-2xl flex-row items-center justify-between">
              <AppText variant="body" className="text-gray-800">
                Report User
              </AppText>
            </Pressable>
            <Pressable onPress={handleBlock} className="bg-slate-100 p-4 rounded-2xl flex-row items-center justify-between">
              <AppText variant="body" className="text-red-500 font-sans-bold">
                Block User
              </AppText>
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

OtherUserSettingsModal.displayName = 'OtherUserSettingsModal';
