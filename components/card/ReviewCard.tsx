import AppText from "@/components/common/AppText";
import Card from "@/components/common/Card";
import { Book } from "@/types/book";
import { useRouter } from "expo-router";
import React from "react";
import { View, ViewProps } from "react-native";
import BookItem from "../book/BookItem";
import IconButton from "../button/IconButton";
import UserHeader from "../common/UserHeader";

interface ReviewProps extends ViewProps {
  firstName?: string;
  lastName?: string;
  username?: string;
  uriAvatar?: string;
  book?: Book;
  postText?: string;
}

const ReviewCard = ({
  firstName = "",
  lastName = "",
  username = "",
  uriAvatar,
  className = "",
  children,
  book,
  postText,
  ...props
}: ReviewProps) => {
  const router = useRouter();
  const [isLiked, setIsLiked] = React.useState(false);

  return (
    <Card className={`p-2 w-full ${className}`} {...props}>
      <View className="flex-row">
        <View className="flex-1 pr-1 justify-start">
          <View className="items-start mb-2">
            <UserHeader 
              firstName={firstName} 
              lastName={lastName} 
              username={username} 
              uriAvatar={uriAvatar} 
            />
          </View>

          {book && (
            <View className="mb-2 flex-row flex-wrap items-center">
              <AppText className="text-xl font-bold" numberOfLines={2}>
                {book.title}
              </AppText>
            </View>
          )}

          {!!postText && (
            <AppText className="text-base leading-relaxed mb-3">
              {postText}
            </AppText>
          )}
          <View className="flex-row items-center mt-2 -ml-3 -mb-2">
            <IconButton
              icon="heartOutline"
              toggledIcon="heartFill"
              toggledColor="red"
              isToggled={isLiked}
              onPress={() => setIsLiked(!isLiked)}
              size="sm"
            />
            <IconButton
              icon="commentOutline"
              pressedIcon="commentFill"
              pressedColor="blue"
              onPress={() => {}}
              size="sm"
              className="-ml-2"
            />
          </View>

          {!!children && (
            <View className="mt-auto pt-1">
              {children}
            </View>
          )}
        </View>

        {book && (
          <View className="justify-end p-1">
            <BookItem book={book} onPress={() => {}} className="w-20 h-32" />
          </View>
        )}
      </View>
    </Card>
  );
};

export default ReviewCard;