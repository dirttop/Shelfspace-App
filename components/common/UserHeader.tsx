import { View } from "react-native";
import AppText from "./AppText";
import Avatar from "./Avatar";

interface UserHeaderProps {
    username?: string;
    firstName?: string;
    lastName?: string;
    uriAvatar?: string;
};

const UserHeader = ({
  username,
  firstName,
  lastName,
  uriAvatar,
  ...props
}: UserHeaderProps) => {
    return (
        <View className = "flex-row items-center justify-center gap-2">
            <Avatar uri={uriAvatar} name={firstName + " " + lastName} size="sm"/>
            <AppText variant = "label">@{username}</AppText>
        </View>
    )
};

export default UserHeader;