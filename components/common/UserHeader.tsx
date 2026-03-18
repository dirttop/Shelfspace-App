import { View } from "react-native";
import AppText from "./AppText";
import Avatar from "./Avatar";

interface UserHeaderProps {
    username?: string;
    firstName?: string;
    lastName?: string;
    uriAvatar?: string;
    rightText?: string;
};

const UserHeader = ({
  username,
  firstName,
  lastName,
  uriAvatar,
  rightText,
  ...props
}: UserHeaderProps) => {
    return (
        <View className="flex-row items-center justify-start gap-2">
            <Avatar uri={uriAvatar} name={firstName + " " + lastName} size="sm"/>
            <AppText variant="body">
                <AppText variant="body" className="font-bold">@{username}</AppText>
                {rightText && (
                    <AppText variant="body" className="text-gray-500">
                        {rightText}
                    </AppText>
                )}
            </AppText>
        </View>
    )
};

export default UserHeader;