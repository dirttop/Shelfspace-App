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
  primary: "bg-slate-300",
  secondary: "bg-slate-300",
  outline: "bg-transparent border-2 border-zinc-900",
};

const containerSizeStyles = {
  sm: "p-2 rounded-3xl",
  md: "p-4 rounded-4xl",
  lg: "p-5 rounded-5xl",
};

const textVariantStyles = {
  primary: "text-zinc-50 dark:text-zinc-900",
  secondary: "text-zinc-900 dark:text-zinc-100",
  outline: "text-zinc-900 dark:text-zinc-100",
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
    ? `bg-slate-800 ${containerSizeStyles[size]} ${className}`
    : `${containerVariantStyles[variant]} ${containerSizeStyles[size]} ${className}`;

  const textClasses = disabled
    ? `text-zinc-500 dark:text-zinc-400 ${textSizeStyles[size]}`
    : `${textVariantStyles[variant]} ${textSizeStyles[size]}`;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`items-center justify-center ${containerClasses}`}
    >
      {loading ? (
        <View className="flex-row items-center">
          <ActivityIndicator
            size="small"
            color={variant === "primary" ? "#fff" : "#000"}
          />
          <AppText className={`font-bold ${textClasses} ml-2`}>
            {title}
          </AppText>
        </View>
      ) : (
        <AppText className={`font-bold ${textClasses}`}>{title}</AppText>
      )}
    </Pressable>
  );
};

export default React.memo(Buttons);
