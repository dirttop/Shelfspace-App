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
              <AppText variant="body" className="font-medium text-foreground">
                Scan Book
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity onPress={props.onSearch} className="bg-muted p-4 rounded-2xl flex-row items-center justify-between">
              <AppText variant="body" className="font-medium text-foreground">
                Search Book
              </AppText>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);



/*
import React, { useEffect, useRef } from "react";
import { Animated, Modal, Pressable, Text } from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  onScan: () => void;
  onSearch: () => void;
}

export default function AddBookModal({
  visible,
  onClose,
  onScan,
  onSearch,
}: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const sheetHeight = 320; // Approximate height of the modal sheet

  useEffect(() => {
    if (visible) {
      // Reset slideAnim to off-screen before animating up
      slideAnim.setValue(sheetHeight);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: sheetHeight,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={onClose}
    >
      <Animated.View
        className="flex-1 justify-end"
        style={{ backgroundColor: "rgba(0,0,0,0.3)", opacity: fadeAnim }}
      >
        <Animated.View
          className="bg-white rounded-t-2xl px-6 pt-6 pb-10 items-center"
          style={{
            transform: [{ translateY: slideAnim }],
          }}
        >
          <Text className="text-xl font-bold mb-6">Add a Book</Text>
          <Pressable
            className="w-full py-3 rounded-lg items-center mb-3 bg-blue-600"
            onPress={onScan}
          >
            <Text className="font-bold text-white text-base">Scan Book</Text>
          </Pressable>
          <Pressable
            className="w-full py-3 rounded-lg items-center mb-3 bg-indigo-100"
            onPress={onSearch}
          >
            <Text className="font-bold text-blue-600 text-base">
              Search Book
            </Text>
          </Pressable>
          <Pressable className="mt-2 p-2" onPress={onClose}>
            <Text className="text-slate-500 text-base">Cancel</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
*/