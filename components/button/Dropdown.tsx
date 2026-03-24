import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, View } from 'react-native';
import AppText from '@/components/common/AppText';
import { BaseModal } from '@/components/modals/BaseModal';

export type DropdownItemType = {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  selected?: boolean;
  separatorBefore?: boolean;
};

export type DropdownProps = {
  isVisible: boolean;
  onClose: () => void;
  items: DropdownItemType[];
  position?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
    width?: number;
  };
};

export const Dropdown = ({ isVisible, onClose, items, position }: DropdownProps) => {
  const hasIcons = items.some(item => item.icon !== undefined || item.selected !== undefined);

  return (
    <BaseModal
      isVisible={isVisible}
      onClose={onClose}
      animationType="fade"
      backdropClasses="bg-transparent" // Dropdowns usually have a transparent or very light backdrop
    >
      <View
        className="absolute bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
        style={{
          width: position?.width ?? 220,
          ...(position?.top !== undefined ? { top: position.top } : {}),
          ...(position?.bottom !== undefined ? { bottom: position.bottom } : {}),
          ...(position?.left !== undefined ? { left: position.left } : {}),
          ...(position?.right !== undefined ? { right: position.right } : {}),
        }}
      >
        {items.map((item, index) => (
          <React.Fragment key={`${item.label}-${index}`}>
            {item.separatorBefore && <View className="h-[1px] bg-gray-200" />}
            <Pressable
              onPress={() => {
                item.onPress();
                onClose();
              }}
              className="flex-row items-center px-4 py-3 active:bg-gray-50 transition-colors"
            >
              {hasIcons && (
                <View className="w-6 mr-2 items-center justify-center">
                  {item.selected && (
                    <Feather name="check" size={18} color="#000" />
                  )}
                  {!item.selected && item.icon && (
                     <View className="items-center justify-center">{item.icon}</View>
                  )}
                </View>
              )}
              <AppText variant="body" className="text-gray-900 whitespace-nowrap" numberOfLines={1}>{item.label}</AppText>
            </Pressable>
          </React.Fragment>
        ))}
      </View>
    </BaseModal>
  );
};
