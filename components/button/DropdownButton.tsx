/* eslint-disable @typescript-eslint/no-unused-vars */
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import type { DimensionValue } from "react-native";
import AppText from "@/components/common/AppText";
import {
  containerSizeStyles,
  containerVariantStyles,
  textSizeStyles,
  textVariantStyles,
} from "@/components/button/styles/buttonStyles";
import { Dropdown, DropdownItemType } from "@/components/button/Dropdown";

const min_width = 220;
const y_offset = 6;
const min_left_margin = 16;

export interface DropdownButtonProps {
  title: string;
  onPress?: () => void | Promise<void>;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  buttonClassName?: string;
  dropdownItems: DropdownItemType[];
  dropdownPosition?: "left" | "right";
  menuOnly?: boolean;
  buttonMaxWidth?: DimensionValue;
  dropdownMaxWidth?: DimensionValue;
}

const DropdownButton = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
  size = "md",
  className = "",
  buttonClassName = "",
  dropdownItems,
  dropdownPosition = "right",
  menuOnly = false,
  buttonMaxWidth,
  dropdownMaxWidth,
}: DropdownButtonProps) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownCoords, setDropdownCoords] = useState<{ top?: number; left?: number; width?: number }>({});
  const [selectedItem, setSelectedItem] = useState<DropdownItemType | null>(null);
  
  const buttonRef = useRef<View>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);
  
  const iconSize = size === "sm" ? 16 : 20;
  
  const textClasses = disabled
    ? `text-white/60 dark:text-zinc-300 ${textSizeStyles[size]}`
    : `${variant === "outline" || variant === "ghost" ? "text-primary" : "text-white"} ${textSizeStyles[size]}`;

  const iconColor = disabled ? "rgba(255,255,255,0.6)" : variant === "outline" || variant === "ghost" ? "#1e656d" : "#fff";
  
  const handleDropdownPress = useCallback(() => {
    buttonRef.current?.measureInWindow((x, y, width, height) => {
      if (!isMounted.current) return;

      const popupWidth = Math.max(width, min_width);
      setDropdownCoords({
        top: y + height + y_offset,
        left: Math.max(min_left_margin, dropdownPosition === "right" ? x + width - popupWidth : x),
        width: popupWidth,
      });
      setDropdownVisible(!dropdownVisible);
    });
  }, [dropdownPosition, dropdownVisible]);

  const formattedDropdownItems = useMemo(() => {
    return dropdownItems.map((item) => ({
      ...item,
      onPress: () => {
        if (!menuOnly) setSelectedItem(item);
        if (item.onPress) item.onPress();
        setDropdownVisible(false);
      },
      selected: menuOnly ? false : !!(item.selected || (selectedItem && item.label === selectedItem.label)),
    }));
  }, [dropdownItems, menuOnly, selectedItem]);

  const displayText = !menuOnly && selectedItem ? selectedItem.label : title;

  return (
    <View ref={buttonRef} className={`flex-shrink-0 flex-row overflow-visible ${className}`} style={buttonMaxWidth !== undefined ? { maxWidth: buttonMaxWidth } : undefined}>
      <Pressable
        onPress={handleDropdownPress}
        disabled={disabled || loading}
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || loading, expanded: dropdownVisible }}
        className={`flex-row items-center justify-between flex-1 gap-2 w-full
          ${containerSizeStyles[size]} 
          ${disabled ? "bg-[#1e656d]" : variant === "ghost" ? "bg-transparent" : containerVariantStyles[variant]} 
          ${buttonClassName}
          active:opacity-80`}
      >
        {loading && (
          <ActivityIndicator size="small" color={variant === "primary" ? "#fff" : "#000"} />
        )}
        <AppText className={`flex-1 font-fraunces-bold ${buttonClassName.includes('justify-center') ? 'text-center' : 'text-left'} ${textClasses}`} numberOfLines={1}>
          {displayText}
        </AppText>
        <Feather 
          name={dropdownVisible ? "chevron-up" : "chevron-down"} 
          color={iconColor} 
          size={iconSize} 
        />
      </Pressable>
      
      {dropdownVisible && (
        <Dropdown
          isVisible={dropdownVisible}
          onClose={() => setDropdownVisible(false)}
          position={dropdownCoords}
          items={formattedDropdownItems}
          maxWidth={dropdownMaxWidth}
        />
      )}
    </View>
  );
};

export default React.memo(DropdownButton);