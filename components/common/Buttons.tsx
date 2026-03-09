import { cssInterop } from "nativewind";
import { PressableScale } from "pressto";
import React from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import DropdownButton from "../button/DropdownButton";
import { DropdownItemType } from "../modals/Dropdown";
import AppText from "./AppText";

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
  dropdownItems?: DropdownItemType[];
  dropdownPosition?: "left" | "right";
}

export const containerVariantStyles = {
  primary: "bg-primary ",
  secondary: "bg-secondary",
  outline: "bg-transparent border-2 border-primary",
};

export const containerSizeStyles = {
  sm: "py-1 px-3 rounded-xl",
  md: "py-2 px-6 rounded-2xl",
  lg: "py-3 px-8 rounded-3xl",
};

export const textVariantStyles = {
  primary: "text-primary-foreground",
  secondary: "text-secondary-foreground",
  outline: "text-primary",
};

export const textSizeStyles = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-xl",
};

const Buttons = ({
  title,
  onPress,
  disabled,
  loading = false,
  variant = "primary",
  size = "md",
  className = "",
  dropdownItems,
  dropdownPosition = "right",
}: ButtonProps) => {
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
      className={`items-center justify-center ${defaultContainerClasses}`}
    >
      {loading ? (
        <View className="flex-row items-center">
          <ActivityIndicator
            size="small"
            color={variant === "primary" ? "#fff" : "#000"}
          />
          <AppText className={`font-sono-bold ${textClasses} ml-2`}>
            {title}
          </AppText>
        </View>
      ) : (
        <AppText className={`font-sono-bold ${textClasses}`}>{title}</AppText>
      )}
    </Pressable>
  );
};

export default React.memo(Buttons);
