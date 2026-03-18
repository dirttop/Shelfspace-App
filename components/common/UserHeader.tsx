import { View } from "react-native";
import AppText from "./AppText";
import Avatar from "./Avatar";
import { Link } from "expo-router";

interface UserHeaderProps {
    userId?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    uriAvatar?: string;
    rightText?: string;
};

const UserHeader = ({
  userId,
  username,
  firstName,
  lastName,
  uriAvatar,
  rightText,
  ...props
}: UserHeaderProps) => {
    const content = (
        <View className = "flex-row items-center justify-center gap-2">
            <Avatar uri={uriAvatar} name={firstName + " " + lastName} size="sm"/>
            <AppText variant="body">
                <AppText variant="label">@{username}</AppText>
                {rightText && (
                    <AppText variant="body" className="text-gray-500">
                        {rightText}
                    </AppText>
                )}
            </AppText>
        </View>
    );

    if (userId) {
        return (
            <Link href={`/(main)/user/${userId}`} asChild>
                {content}
            </Link>
        );
    }

    return content;
};

export default UserHeader;