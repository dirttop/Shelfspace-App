import React from 'react';
import { Pressable, Text } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

const Buttons = ({ title, onPress, disabled, variant = 'primary' }: ButtonProps) => {

  const getVariantStyle = () => {
    if (disabled) return 'bg-gray-300 dark:bg-gray-700';

    switch (variant) {
      case 'secondary': return 'bg-gray-200 dark:bg-gray-700';
      case 'outline': return 'bg-transparent border-2 border-blue-600';
      case 'primary':
      default: return 'bg-blue-600';
    }
  };

  const getTextStyle = () => {
    if (disabled) return 'text-gray-500 dark:text-gray-400';
    if (variant === 'secondary') return 'text-gray-900 dark:text-white';
    return variant === 'outline' ? 'text-blue-600' : 'text-white';
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`p-4 rounded-xl items-center justify-center mb-4 ${getVariantStyle()}`}
    >
      <Text className={`font-bold text-lg ${getTextStyle()}`}>
        {title}
      </Text>
    </Pressable>
  );
};

export default Buttons;