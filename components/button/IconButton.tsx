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
  toggledIcon?: IconName;
  pressedIcon?: IconName;
  isToggled?: boolean;
  color?: string;
  toggledColor?: string;
  pressedColor?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
  className?: string;
}

const sizeMap = {
  xs: "w-6 h-6",
  sm: "w-10 h-10",
  md: "w-16 h-16",
  lg: "w-20 h-20",
  xl: "w-24 h-24",
};

const IconButton = ({
  onPress,
  icon,
  toggledIcon,
  pressedIcon,
  isToggled = false,
  color = "white",
  toggledColor,
  pressedColor,
  size = "md",
  disabled = false,
  className = "",
}: IconButtonProps) => {
  const [isPressed, setIsPressed] = React.useState(false);

  let currentIconName = icon;
  let currentColor = color;

  if (isToggled && toggledIcon) currentIconName = toggledIcon;
  else if (isPressed && pressedIcon) currentIconName = pressedIcon;

  if (isToggled && toggledColor) currentColor = toggledColor;
  else if (isPressed && pressedColor) currentColor = pressedColor;

  const IconComponent = Icons[currentIconName];

  if (!IconComponent) {
    console.warn(`Icon "${currentIconName}" not found in Icons component.`);
    return null;
  }

  return (
    <StyledPressable
      onPress={disabled ? undefined : onPress}
      onPressIn={disabled ? undefined : () => setIsPressed(true)}
      onPressOut={disabled ? undefined : () => setIsPressed(false)}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      className={`items-center justify-center rounded-full p-2 ${className} ${
        disabled ? "opacity-50" : "active:opacity-75"
      }`}
    >
      <View className={`${sizeMap[size]}`}>
        <IconComponent color={currentColor} width="100%" height="100%" />
      </View>
    </StyledPressable>
  );
};

export default React.memo(IconButton);