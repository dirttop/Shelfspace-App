import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import AppText from '../common/AppText';

export type AddBookModalProps = {
  onScan: () => void;
  onSearch: () => void;
};

export const AddBookModal = forwardRef<BottomSheetModal, AddBookModalProps>(
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
        backgroundStyle={{ backgroundColor: 'white' }}
        handleIndicatorStyle={{ backgroundColor: '#A1A1AA', opacity: 0.8 }}
      >
        <BottomSheetView style={{ flex: 1, backgroundColor: 'white' }} className="px-6 pt-2 pb-8">
          <AppText variant="title" className="mb-6">
            Add a Book
          </AppText>

          <View className="gap-y-3">
            <TouchableOpacity onPress={props.onScan} className="bg-muted p-4 rounded-2xl flex-row items-center justify-between">
              <AppText variant="body" className="text-foreground">
                Scan Book
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity onPress={props.onSearch} className="bg-muted p-4 rounded-2xl flex-row items-center justify-between">
              <AppText variant="body" className="text-foreground">
                Search Book
              </AppText>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);



AddBookModal.displayName = 'AddBookModal';
