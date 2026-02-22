import AppText from "@/components/common/AppText";
import Card from "@/components/common/Card";
import { Book } from "@/types/book";
import { useRouter } from "expo-router";
import React from "react";
import { View, ViewProps } from "react-native";
import BookItem from "../book/BookItem";
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
  return (
    <Card className={`p-4 ${className}`} {...props}>
      <View className="items-start mb-4">
        <UserHeader 
          firstName={firstName} 
          lastName={lastName} 
          username={username} 
          uriAvatar={uriAvatar} 
        />
      </View>
      <View className="flex-row">
        {book && (
          <View className="mr-3">
            <BookItem book={book} onPress={() => {}} />
          </View>
        )}
        <View className="flex-1 justify-top mt-4">
          {!!postText && (
            <AppText className="text-gray-800 mb-2">{postText}</AppText>
          )}
          {!!children && (
            <AppText className="text-gray-800">{children}</AppText>
          )}
        </View>
      </View>
    </Card>
  );
};

export default ReviewCard;