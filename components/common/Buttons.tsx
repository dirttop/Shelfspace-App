import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

interface ButtonProps {
  title: string;
  onPress?: () => void | Promise<void>;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

const Buttons = ({
  title,
  onPress,
  disabled,
  loading = false,
  variant = "primary",
  size = "md",
}: ButtonProps) => {
  const getVariantStyle = () => {
    if (disabled) return "bg-zinc-100 dark:bg-zinc-800";

    switch (variant) {
      case "secondary":
        return "bg-zinc-100 dark:bg-zinc-800";
      case "outline":
        return "bg-transparent border-2 border-zinc-900 dark:border-zinc-100";
      case "primary":
      default:
        return "bg-zinc-900 dark:bg-zinc-100";
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case "sm":
        return "p-2 mb-2 rounded-lg";
      case "lg":
        return "p-5 mb-5 rounded-2xl";
      case "md":
      default:
        return "p-4 mb-4 rounded-xl";
    }
  };

  const getTextStyle = () => {
    let colorClass = "";
    if (disabled) colorClass = "text-zinc-500 dark:text-zinc-400";
    else if (variant === "secondary")
      colorClass = "text-zinc-900 dark:text-zinc-100";
    else
      colorClass =
        variant === "outline"
          ? "text-zinc-900 dark:text-zinc-100"
          : "text-zinc-50 dark:text-zinc-900";

    let sizeClass = "";
    switch (size) {
      case "sm":
        sizeClass = "text-sm";
        break;
      case "lg":
        sizeClass = "text-xl";
        break;
      case "md":
      default:
        sizeClass = "text-lg";
        break;
    }

    return `${colorClass} ${sizeClass}`;
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`items-center justify-center ${getSizeStyle()} ${getVariantStyle()}`}
    >
      {loading ? (
        <View className="flex-row items-center">
          <ActivityIndicator
            size="small"
            color={variant === "primary" ? "#fff" : "#000"}
          />
          <Text className={`font-bold ${getTextStyle()} ml-2`}>{title}</Text>
        </View>
      ) : (
        <Text className={`font-bold ${getTextStyle()}`}>{title}</Text>
      )}
    </Pressable>
  );
};

export default Buttons;
