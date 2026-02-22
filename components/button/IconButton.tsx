import { cssInterop } from "nativewind";
import { PressableScale } from "pressto";
import React from "react";
import { View } from "react-native";
import { IconName } from "../../assets/svgs";
import Icons from "../common/Icons";

const StyledPressable = cssInterop(PressableScale, {
  className: "style",
});

interface IconButtonProps {
  onPress?: () => void;
  icon: IconName;
  color?: string;
  size?: "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "w-10 h-10",
  md: "w-16 h-16",
  lg: "w-20 h-20",
  xl: "w-24 h-24",
};

const IconButton = ({
  onPress,
  icon,
  color = "white",
  size = "md",
  disabled = false,
  className = "",
}: IconButtonProps) => {
  const IconComponent = Icons[icon];

  if (!IconComponent) {
    console.warn(`Icon "${icon}" not found in Icons component.`);
    return null;
  }

  return (
    <StyledPressable
      onPress={disabled ? undefined : onPress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      className={`items-center justify-center rounded-full p-2 ${className} ${
        disabled ? "opacity-50" : "active:opacity-75"
      }`}
    >
      <View className={`${sizeMap[size]}`}>
        <IconComponent color={color} />
      </View>
    </StyledPressable>
  );
};

export default React.memo(IconButton);