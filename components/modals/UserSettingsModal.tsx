import React from 'react';
import { View } from 'react-native';
import AppText from '../common/AppText';
import { BaseModal } from './BaseModal';

type UserSettingsModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

export const UserSettingsModal = ({ isVisible, onClose }: UserSettingsModalProps) => {
  return (
    <BaseModal
      isVisible={isVisible}
      onClose={onClose}
      animationType="slide"
      containerClasses="justify-center items-center px-4"
    >
      <View className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl">
        <AppText className="text-xl font-bold mb-4">User Settings</AppText>
        
        {/* Placeholder content */}
        <View className="space-y-4">
          <View className="bg-gray-50 p-4 rounded-xl">
            <AppText className="text-gray-600">Appearance options will go here</AppText>
          </View>
          <View className="bg-gray-50 p-4 rounded-xl">
            <AppText className="text-gray-600">Account settings will go here</AppText>
          </View>
        </View>
      </View>
    </BaseModal>
  );
};
