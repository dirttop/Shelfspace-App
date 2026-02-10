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
    if (disabled) return 'bg-zinc-100 dark:bg-zinc-800';

    switch (variant) {
      case 'secondary': return 'bg-zinc-100 dark:bg-zinc-800';
      case 'outline': return 'bg-transparent border-2 border-zinc-900 dark:border-zinc-100';
      case 'primary':
      default: return 'bg-zinc-900 dark:bg-zinc-100';
    }
  };

  const getTextStyle = () => {
    if (disabled) return 'text-zinc-500 dark:text-zinc-400';
    if (variant === 'secondary') return 'text-zinc-900 dark:text-zinc-100';
    return variant === 'outline' ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-50 dark:text-zinc-900';
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