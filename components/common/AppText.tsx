import type { TextProps } from "react-native";
import { Text } from "react-native";

interface AppTextProps extends TextProps {
  variant?: "title" | "subtitle" | "body" | "caption";
}

const AppText = ({
  children,
  variant = "body",
  style,
  className,
  ...props
}: AppTextProps) => {
  const baseClasses = "text-zinc-900 dark:text-gray-100";

  const variantClasses = {
    title: "text-3xl font-bold",
    subtitle: "text-2xl font-semibold",
    body: "text-base font-normal",
    caption: "text-xs font-normal",
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${
    className || ""
  }`;

  return (
    <Text className={combinedClasses} style={style} {...props}>
      {children}
    </Text>
  );
};

export default AppText;