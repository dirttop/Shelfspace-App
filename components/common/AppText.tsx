import { Feather } from "@expo/vector-icons";
import { memo, useMemo, useState } from "react";
import type { TextProps } from "react-native";
import { Pressable, Text, View } from "react-native";

import { appTextBaseClasses, appTextVariantClasses } from "@/components/common/styles/appTextStyles";

export interface AppTextProps extends TextProps {
  variant?:
    | "title"
    | "subtitle"
    | "body"
    | "caption"
    | "label"
    | "collapsible";
  charLimit?: number;
}

const CollapsibleTextContent = ({
  children,
  charLimit = 150,
  style,
  className,
  ...props
}: AppTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const text = typeof children === "string" ? children : "";
  const shouldCollapse = text.length > charLimit;

  const displayText = useMemo(() => {
    if (!shouldCollapse || isExpanded) return text;
    return text.slice(0, charLimit).trim() + "...";
  }, [text, isExpanded, shouldCollapse, charLimit]);

  const combinedClasses = `${appTextBaseClasses} ${appTextVariantClasses.collapsible} ${
    className || ""
  }`;

  return (
    <View className="flex-col">
      <Text className={combinedClasses} style={style} {...props}>
        {displayText}
      </Text>
      {shouldCollapse && (
        <Pressable
          className="flex-row items-center mt-1"
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <Text className={`${appTextBaseClasses} ${appTextVariantClasses.label} text-zinc-500 mr-1`}>
            {isExpanded ? "Show Less" : "Read More"}
          </Text>
          {isExpanded ? (
            <Feather name="chevron-up" size={16} color="#71717a" />
          ) : (
            <Feather name="chevron-down" size={16} color="#71717a" />
          )}
        </Pressable>
      )}
    </View>
  );
};

const AppText = ({
  children,
  variant = "body",
  style,
  className,
  charLimit,
  ...props
}: AppTextProps) => {
  if (variant === "collapsible") {
    return (
      <CollapsibleTextContent
        charLimit={charLimit}
        style={style}
        className={className}
        {...props}
      >
        {children}
      </CollapsibleTextContent>
    );
  }

  const combinedClasses = `${appTextBaseClasses} ${appTextVariantClasses[variant]} ${
    className || ""
  }`;

  return (
    <Text className={combinedClasses} style={style} {...props}>
      {children}
    </Text>
  );
};

export default memo(AppText);