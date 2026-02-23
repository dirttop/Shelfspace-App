import React from 'react';
import { Modal, Pressable, View } from 'react-native';

export type BaseModalProps = {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  backdropClasses?: string;
  containerClasses?: string;
  animationType?: 'none' | 'slide' | 'fade';
};

export const BaseModal = ({
  isVisible,
  onClose,
  children,
  backdropClasses = 'bg-black/30',
  containerClasses = '',
  animationType = 'fade',
}: BaseModalProps) => {
  return (
    <Modal
      transparent
      visible={isVisible}
      animationType={animationType}
      onRequestClose={onClose}
    >
      <View className={`flex-1 ${backdropClasses}`}>
        <Pressable
          className="absolute inset-0 z-0"
          onPress={onClose}
          accessibilityLabel="Close overlay"
        />
        <View
          pointerEvents="box-none"
          className={`flex-1 z-10 ${containerClasses}`}
        >
          {children}
        </View>
      </View>
    </Modal>
  );
};
