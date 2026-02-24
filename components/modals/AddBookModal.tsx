import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

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
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/30 justify-end">
        <View className="bg-white rounded-t-2xl px-6 pt-6 pb-10 items-center">
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
            <Text className="font-bold text-blue-600 text-base">Search Book</Text>
          </Pressable>
          <Pressable className="mt-2 p-2" onPress={onClose}>
            <Text className="text-slate-500 text-base">Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}