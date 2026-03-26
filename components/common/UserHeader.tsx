import { View, Pressable } from "react-native";
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
    align?: 'left' | 'center';
};

const UserHeader = ({
  userId,
  username,
  firstName,
  lastName,
  uriAvatar,
  rightText,
  align = 'center',
  ...props
}: UserHeaderProps) => {
    const content = (
        <Pressable className={`flex-row items-center gap-2 ${align === 'left' ? 'justify-start' : 'justify-center'}`}>
            <Avatar uri={uriAvatar} name={firstName + " " + lastName} size="sm"/>
            <AppText variant = "label">@{username}</AppText>
            {rightText && (
                <AppText variant="caption" className="text-gray-500">
                    {rightText}
                </AppText>
            )}
        </Pressable>
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