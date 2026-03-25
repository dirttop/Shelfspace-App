import { cssInterop } from "nativewind";
import { PressableScale } from "pressto";
import React from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import DropdownButton from "@/components/button/DropdownButton";
import { DropdownItemType } from "@/components/button/Dropdown";
import AppText from "@/components/common/AppText";

const StyledPressable = cssInterop(PressableScale, {
  className: "style",
});

export interface ButtonProps {
  title: string;
  onPress?: () => void | Promise<void>;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  textClassName?: string;
  dropdownItems?: DropdownItemType[];
  dropdownPosition?: "left" | "right";
}

import {
  containerSizeStyles,
  containerVariantStyles,
  textSizeStyles,
  textVariantStyles,
} from "@/components/button/styles/buttonStyles";

export {
  containerSizeStyles,
  containerVariantStyles,
  textSizeStyles,
  textVariantStyles,
};

const Buttons = ({
  title,
  onPress,
  disabled,
  loading = false,
  variant = "primary",
  size = "md",
  className = "",
  textClassName = "font-sans-bold",
  dropdownItems,
  dropdownPosition = "right",
}: ButtonProps) => {
const containerClasses = disabled
    ? `bg-[#1e656d] ${containerSizeStyles[size]} ${className}`
    : `${containerVariantStyles[variant]} ${containerSizeStyles[size]} ${className}`;
  const textClasses = disabled
    ? `text-white/60 dark:text-zinc-300 ${textSizeStyles[size]}`
    : `${textVariantStyles[variant]} ${textSizeStyles[size]}`;

  if (dropdownItems && dropdownItems.length > 0) {
    return (
      <DropdownButton
        title={title}
        onPress={onPress}
        disabled={disabled}
        loading={loading}
        variant={variant}
        size={size}
        className={className}
        dropdownItems={dropdownItems}
        dropdownPosition={dropdownPosition}
      />
    );
  }

  const defaultContainerClasses = disabled
    ? `bg-[#1e656d] ${containerSizeStyles[size]} ${className}`
    : `${containerVariantStyles[variant]} ${containerSizeStyles[size]} ${className}`;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`items-center justify-center ${containerClasses}`}
      style={({ pressed }) => [
        pressed ? { opacity: 0.8 } : {}
      ]}
    >
      {loading ? (
        <View className="flex-row items-center">
          <ActivityIndicator
            size="small"
            color={variant === "primary" ? "#fff" : "#000"}
          />
          <AppText className={`${textClassName} ${textClasses} ml-2`}>
            {title}
          </AppText>
        </View>
      ) : (
        <AppText className={`${textClassName} ${textClasses}`}>{title}</AppText>
      )}
    </Pressable>
  );
};

export default React.memo(Buttons);
