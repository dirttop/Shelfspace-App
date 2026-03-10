import { ChevronDown } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import AppText from "../common/AppText";
import {
  containerSizeStyles,
  containerVariantStyles,
  textSizeStyles,
  textVariantStyles,
} from "./buttonStyles";
import { Dropdown, DropdownItemType } from "../modals/Dropdown";

export interface DropdownButtonProps {
  title: string;
  onPress?: () => void | Promise<void>;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  dropdownItems: DropdownItemType[];
  dropdownPosition?: "left" | "right";
  menuOnly?: boolean;
}

const DropdownButton = ({
  title,
  onPress,
  disabled,
  loading = false,
  variant = "primary",
  size = "md",
  className = "",
  dropdownItems,
  dropdownPosition = "right",
  menuOnly = false,
}: DropdownButtonProps) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [currentAction, setCurrentAction] = useState({ title, onPress });
  const buttonRef = useRef<View>(null);
  const [dropdownCoords, setDropdownCoords] = useState<{
    top?: number;
    left?: number;
    width?: number;
  }>({});

  useEffect(() => {
    setCurrentAction({ title, onPress });
  }, [title, onPress]);

  const textClasses = disabled
    ? `text-white/60 dark:text-zinc-300 ${textSizeStyles[size]}`
    : `${textVariantStyles[variant]} ${textSizeStyles[size]}`;

  const iconColor = disabled
    ? "rgba(255,255,255,0.6)"
    : variant === "outline"
    ? "#1e656d"
    : "#fff";

  const handleDropdownPress = () => {
    buttonRef.current?.measureInWindow((x, y, width, height) => {
      const popupWidth = Math.max(width, 220);
      setDropdownCoords({
        top: y + height + 6, // 6px gap below button
        left: Math.max(16, dropdownPosition === "right" ? x + width - popupWidth : x),
        width: popupWidth,
      });
      setDropdownVisible(true);
    });
  };

  const handleDropdownItemSelect = (item: DropdownItemType) => {
    if (!menuOnly) {
      setCurrentAction({ title: item.label, onPress: item.onPress });
    }
  };

  const isLeft = dropdownPosition === "left";
  const mainPadding =
    size === "sm" ? "px-3" : size === "md" ? "px-4" : "px-6";
  const dropPadding =
    size === "sm" ? "px-2" : size === "md" ? "px-2" : "px-4";
  const verticalPadding = 
    size === "sm" ? "py-1" : size === "md" ? "py-2" : "py-3";

  const dividerColor =
    variant === "outline" ? "border-primary" : "border-white/20";
  const dividerClasses = isLeft
    ? `border-r ${dividerColor}`
    : `border-l ${dividerColor}`;

  const splitContainerClasses = disabled
    ? `bg-[#1e656d] ${className}`
    : `${containerVariantStyles[variant]} ${className}`;

  const roundedClasses = containerSizeStyles[size]
    .replace(/py-\d+|px-\d+/g, "")
    .trim();

  return (
    <View
      ref={buttonRef}
      className={`flex-row items-stretch justify-center overflow-hidden flex-shrink-0 ${roundedClasses} ${splitContainerClasses}`}
    >
      {isLeft && (
        <Pressable
          onPress={handleDropdownPress}
          disabled={disabled || loading}
          className={`justify-center items-center active:opacity-80 ${verticalPadding} ${dropPadding} ${dividerClasses}`}
        >
          <ChevronDown color={iconColor} size={size === "sm" ? 16 : 20} />
        </Pressable>
      )}

      <Pressable
        onPress={menuOnly ? handleDropdownPress : currentAction.onPress}
        disabled={disabled || loading}
        className={`flex-row items-center justify-center active:opacity-80 ${verticalPadding} ${mainPadding}`}
      >
        {loading ? (
          <View className="flex-row items-center">
            <ActivityIndicator
              size="small"
              color={variant === "primary" ? "#fff" : "#000"}
            />
            <AppText className={`font-sono-bold ${textClasses} ml-2`}>
              {currentAction.title}
            </AppText>
          </View>
        ) : (
          <AppText className={`font-sono-bold ${textClasses}`}>
            {currentAction.title}
          </AppText>
        )}
      </Pressable>

      {!isLeft && (
        <Pressable
          onPress={handleDropdownPress}
          disabled={disabled || loading}
          className={`justify-center items-center active:opacity-80 ${verticalPadding} ${dropPadding} ${dividerClasses}`}
        >
          <ChevronDown color={iconColor} size={size === "sm" ? 16 : 20} />
        </Pressable>
      )}

      {dropdownVisible && (
        <Dropdown
          isVisible={dropdownVisible}
          onClose={() => setDropdownVisible(false)}
          position={dropdownCoords}
          items={dropdownItems.map((item) => ({
            ...item,
            onPress: () => {
              handleDropdownItemSelect(item);
              item.onPress();
            },
          }))}
        />
      )}
    </View>
  );
};

export default React.memo(DropdownButton);
