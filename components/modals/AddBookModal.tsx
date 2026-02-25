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
