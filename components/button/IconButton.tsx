/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { IconName } from "../../assets/svgs";
import Icons from "../common/Icons";
import { Colors } from "@/constants/Colors";

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
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
  xl: "w-14 h-14",
};

const IconButton = ({
  onPress,
  icon,
  toggledIcon,
  pressedIcon,
  isToggled = false,
  color = Colors.mutedForeground,
  toggledColor,
  pressedColor,
  size = "md",
  disabled = false,
  className = "",
}: IconButtonProps) => {
  const [isPressed, setIsPressed] = React.useState(false);
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    setIsPressed(true);
    scale.value = withSpring(0.85, {
      damping: 15,
      mass: 0.5,
      stiffness: 400,
    });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    setIsPressed(false);
    scale.value = withSpring(1, {
      damping: 15,
      mass: 0.5,
      stiffness: 400,
    });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  let currentIconName = icon;
  let currentColor = color;

  if (isPressed && pressedIcon) currentIconName = pressedIcon;
  else if (isToggled && toggledIcon) currentIconName = toggledIcon;

  if (isPressed && pressedColor) currentColor = pressedColor;
  else if (isToggled && toggledColor) currentColor = toggledColor;

  const IconComponent = Icons[currentIconName];

  if (!IconComponent) {
    console.warn(`Icon "${currentIconName}" not found in Icons component.`);
    return null;
  }

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={disabled ? undefined : handlePressIn}
      onPressOut={disabled ? undefined : handlePressOut}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      className={`items-center justify-center rounded-full p-2 ${className} ${
        disabled ? "opacity-50" : ""
      }`}
    >
      <Animated.View style={[animatedStyle]} className={`${sizeMap[size]} items-center justify-center`}>
        <IconComponent color={currentColor} size={size === 'xs' ? 16 : size === 'sm' ? 20 : size === 'md' ? 24 : size === 'lg' ? 28 : 32} />
      </Animated.View>
    </Pressable>
  );
};

export default React.memo(IconButton);