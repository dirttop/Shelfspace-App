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
    if (disabled) return 'bg-muted';

    switch (variant) {
      case 'secondary': return 'bg-secondary';
      case 'outline': return 'bg-transparent border-2 border-primary';
      case 'primary':
      default: return 'bg-primary';
    }
  };

  const getTextStyle = () => {
    if (disabled) return 'text-muted-foreground';
    if (variant === 'secondary') return 'text-secondary-foreground';
    return variant === 'outline' ? 'text-primary' : 'text-primary-foreground';
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