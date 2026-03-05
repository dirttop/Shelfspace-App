import { cssInterop } from "nativewind";
import { PressableScale } from "pressto";
import React from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import AppText from "./AppText";

const StyledPressable = cssInterop(PressableScale, {
  className: "style",
});

interface ButtonProps {
  title: string;
  onPress?: () => void | Promise<void>;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const containerVariantStyles = {
  primary: "bg-primary ",
  secondary: "bg-secondary",
  outline: "bg-transparent border-2 border-primary",
};

const containerSizeStyles = {
  sm: "py-1 px-3 rounded-xl",
  md: "py-1 px-6 rounded-2xl",
  lg: "py-2 px-8 rounded-3xl",
};

const textVariantStyles = {
  primary: "text-primary-foreground",
  secondary: "text-secondary-foreground",
  outline: "text-primary",
};

const textSizeStyles = {
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
}: ButtonProps) => {
  const containerClasses = disabled
    ? `bg-[#1e656d] ${containerSizeStyles[size]} ${className}`
    : `${containerVariantStyles[variant]} ${containerSizeStyles[size]} ${className}`;

  const textClasses = disabled
    ? `text-white/60 dark:text-zinc-300 ${textSizeStyles[size]}`
    : `${textVariantStyles[variant]} ${textSizeStyles[size]}`;

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
