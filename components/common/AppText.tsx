import { ChevronDown, ChevronUp } from "lucide-react-native";
import { memo, useMemo, useState } from "react";
import type { TextProps } from "react-native";
import { Pressable, Text, View } from "react-native";

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

const baseClasses = "text-zinc-900";

const variantClasses = {
  title: "text-4xl font-sono-bold",
  subtitle: "text-xl font-sono-semibold",
  body: "text-base font-sans",
  caption: "text-xs font-sans",
  label: "text-sm font-sono-medium",
  collapsible: "text-base font-sans",
};

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

  const combinedClasses = `${baseClasses} ${variantClasses.collapsible} ${
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
          <Text className={`${baseClasses} ${variantClasses.label} text-zinc-500 mr-1`}>
            {isExpanded ? "Show Less" : "Read More"}
          </Text>
          {isExpanded ? (
            <ChevronUp size={16} color="#71717a" />
          ) : (
            <ChevronDown size={16} color="#71717a" />
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

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${
    className || ""
  }`;

  return (
    <Text className={combinedClasses} style={style} {...props}>
      {children}
    </Text>
  );
};

export default memo(AppText);