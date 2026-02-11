import { cssInterop } from 'nativewind';
import { PressableScale } from 'pressto';
import React from 'react';
import AppText from './AppText';

const StyledPressable = cssInterop(PressableScale, {
  className: "style",
});

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const Buttons = ({ title, onPress, disabled, variant = 'primary', size = 'md' }: ButtonProps) => {

  const getVariantStyle = () => {
    if (disabled) return 'bg-slate-800';

    switch (variant) {
      case 'secondary': return 'bg-slate-300';
      case 'outline': return 'bg-transparent border-2 border-zinc-900';
      case 'primary':
      default: return 'bg-slate-300';
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm': return 'p-2 mb-2 rounded-lg';
      case 'lg': return 'p-5 mb-5 rounded-2xl';
      case 'md':
      default: return 'p-4 mb-4 rounded-xl';
    }
  };

  const getTextStyle = () => {
    let colorClass = '';
    if (disabled) colorClass = 'text-zinc-500';
    else if (variant === 'secondary') colorClass = 'text-zinc-900';
    else colorClass = variant === 'outline' ? 'text-zinc-900' : 'text-zinc-50';

    let sizeClass = '';
    switch (size) {
      case 'sm': sizeClass = 'text-sm'; break;
      case 'lg': sizeClass = 'text-xl'; break;
      case 'md':
      default: sizeClass = 'text-lg'; break;
    }

    return `${colorClass} ${sizeClass}`;
  };

  return (
    <StyledPressable
      onPress={() => !disabled && onPress()}
      className={`items-center justify-center ${getSizeStyle()} ${getVariantStyle()}`}
    >
      <AppText className={`font-bold ${getTextStyle()}`}>
        {title}
      </AppText>
    </StyledPressable>
  );
};

export default Buttons;