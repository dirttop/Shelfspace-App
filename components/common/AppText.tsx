import { memo } from "react";
import type { TextProps } from "react-native";
import { Text } from "react-native";

interface AppTextProps extends TextProps {
  variant?: "title" | "subtitle" | "body" | "caption" | "label";
}

const baseClasses = "text-zinc-900";

const variantClasses = {
  title: "text-4xl font-sono-bold",
  subtitle: "text-2xl font-sono-semibold",
  body: "text-base font-sans",
  caption: "text-xs font-sans",
  label: "text-sm font-sono-medium",
};

const AppText = ({
  children,
  variant = "body",
  style,
  className,
  ...props
}: AppTextProps) => {
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