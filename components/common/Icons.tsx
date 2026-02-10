import React from 'react';
import { Pressable, StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';
import { IconName, icons } from '../../assets/svgs';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  onPress?: () => void;
  accessibilityLabel?: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
  label?: string;
  labelPosition?: 'left' | 'right' | 'top' | 'bottom';
  labelStyle?: StyleProp<TextStyle>;
  labelClassName?: string;
  align?: 'center' | 'flex-start' | 'flex-end' | 'stretch' | 'baseline';
}

const Icons = ({ 
  name, 
  size = 24, 
  color = "#000", 
  onPress, 
  accessibilityLabel,
  className,
  style,
  label,
  labelPosition = 'right',
  labelStyle,
  labelClassName,
  align = 'center',
}: IconProps) => {
  const SvgIcon = icons[name];

  if (!SvgIcon) {
    console.warn(`Icon "${name}" does not exist in icons registry`);
    return null; 
  }

  const iconElement = (
    <SvgIcon
      width={size} 
      height={size} 
      fill={color}
      color={color}
    />
  );

  const labelElement = label ? (
    <Text 
      className={`text-foreground ${labelClassName || ''}`} 
      style={labelStyle}
    >
      {label}
    </Text>
  ) : null;

  const flexDirection = 
    labelPosition === 'left' ? 'row-reverse' :
    labelPosition === 'right' ? 'row' :
    labelPosition === 'top' ? 'column-reverse' : 'column';

  const alignItems = align;
  const gap = 8; // Default gap

  const Container = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      accessibilityLabel={accessibilityLabel || `${name} icon`}
      accessibilityRole={onPress ? "button" : "image"}
      className={className}
      style={[
        { flexDirection, alignItems, gap },
        style
      ]}
    >
      {iconElement}
      {labelElement}
    </Container>
  );
};

export default Icons;