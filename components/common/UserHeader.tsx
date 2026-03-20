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
};

const UserHeader = ({
  userId,
  username,
  firstName,
  lastName,
  uriAvatar,
  ...props
}: UserHeaderProps) => {
    const content = (
        <Pressable className = "flex-row items-center justify-center gap-2">
            <Avatar uri={uriAvatar} name={firstName + " " + lastName} size="sm"/>
            <AppText variant = "label">@{username}</AppText>
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