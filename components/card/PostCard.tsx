import AppText from "@/components/common/AppText";
import Card from "@/components/common/Card";
import { useRouter } from "expo-router";
import React from "react";
import { View, ViewProps } from "react-native";
import UserHeader from "../common/UserHeader";
import CardActions from "./CardActions";

interface ReviewProps extends ViewProps {
  firstName?: string;
  lastName?: string;
  username?: string;
  uriAvatar?: string;
  postText?: string;
}

const PostCard = ({
  firstName = "",
  lastName = "",
  username = "",
  uriAvatar,
  className = "",
  children,
  postText,
  ...props
}: ReviewProps) => {
  const router = useRouter();
  const [isLiked, setIsLiked] = React.useState(false);

  return (
    <Card className={`p-2 w-full ${className}`} {...props}>
      <View className="flex-col w-full">
        <View className="flex-row w-full mb-2">
          <View className="flex-1 pr-4 justify-start">
            <View className="flex-row items-center mt-2 mb-2 gap-x-2">
              <UserHeader 
                firstName={firstName} 
                lastName={lastName} 
                username={username} 
                uriAvatar={uriAvatar} 
              />
            </View>
          </View>
        </View>
          
        {!!postText && (
          <AppText variant="collapsible" className="mb-2 mt-2">
            {postText}
          </AppText>
        )}

        <CardActions 
          isLiked={isLiked}
          onLikePress={() => setIsLiked(!isLiked)}
        />

        {!!children && (
          <View className="mt-2 pt-1">
            {children}
          </View>
        )}
      </View>
    </Card>
  );
};

export default PostCard;