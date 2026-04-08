import AppText from '@/components/common/AppText';
import { BaseModal } from '@/components/modals/BaseModal';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import type { DimensionValue } from 'react-native';
import { Pressable, ScrollView, View } from 'react-native';

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
  maxWidth?: DimensionValue;
};

export const Dropdown = ({ isVisible, onClose, items, position, maxWidth }: DropdownProps) => {
  const hasIcons = items.some(item => item.icon !== undefined || item.selected !== undefined);

  return (
    <BaseModal
      isVisible={isVisible}
      onClose={onClose}
      animationType="fade"
      backdropClasses="bg-transparent"
    >
      <View
        className="absolute bg-background rounded-xl shadow-lg border border-gray-100 overflow-hidden"
        style={{
          width: position?.width ?? 220,
          maxHeight: 300,
          ...(maxWidth !== undefined ? { maxWidth } : {}),
          ...(position?.top !== undefined ? { top: position.top } : {}),
          ...(position?.bottom !== undefined ? { bottom: position.bottom } : {}),
          ...(position?.left !== undefined ? { left: position.left } : {}),
          ...(position?.right !== undefined ? { right: position.right } : {}),
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          {items.map((item, index) => {
            const isSelected = item.selected;
            
            return (
              <React.Fragment key={`${item.label}-${index}`}>
                {item.separatorBefore && <View className="h-[1px] bg-gray-200" />}
                <Pressable
                  onPress={() => {
                    item.onPress();
                    onClose();
                  }}
                  className="flex-row items-center justify-between px-4 py-3 active:bg-gray-100"
                >
                  <AppText variant="body" className="flex-1" numberOfLines={1}>
                    {item.label}
                  </AppText>
                  
                  {hasIcons && (
                    <View className="ml-2 items-center justify-center min-w-[20px]">
                      {isSelected && (
                        <Feather name="check" size={18} color="#000" />
                      )}
                      {!isSelected && item.icon && (
                        <View className="items-center justify-center">{item.icon}</View>
                      )}
                    </View>
                  )}
                </Pressable>
              </React.Fragment>
            );
          })}
        </ScrollView>
      </View>
    </BaseModal>
  );
};
