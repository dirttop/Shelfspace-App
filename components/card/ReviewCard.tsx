import AppText from "@/components/common/AppText";
import Card from "@/components/common/Card";
import { Book } from "@/types/book";
import { useRouter } from "expo-router";
import React from "react";
import { View, ViewProps } from "react-native";
import BookItem from "../book/BookItem";
import IconButton from "../button/IconButton";
import UserHeader from "../common/UserHeader";
import { Rating } from '@kolking/react-native-rating';
import CardActions from "./CardActions";

interface ReviewProps extends ViewProps {
  firstName?: string;
  lastName?: string;
  username?: string;
  uriAvatar?: string;
  userRating?: number;
  book?: Book;
  postText?: string;
  postType?: "review" | "progress";
  progress?: number;
}

const ReviewCard = ({
  firstName = "",
  lastName = "",
  username = "",
  uriAvatar,
  userRating,
  className = "",
  children,
  book,
  postText,
  postType,
  progress,
  ...props
}: ReviewProps) => {
  const router = useRouter();
  const [isLiked, setIsLiked] = React.useState(false);

  return (
    <Card className={`p-2 w-full ${className}`} {...props}>
      <View className="flex-col w-full">
        <View className="flex-row w-full mb-2">
          <View className="flex-1 pr-4 justify-start">
            <View className="flex-row items-center mt-2 mb-2 gap-x-1">
              <UserHeader 
                firstName={firstName} 
                lastName={lastName} 
                username={username} 
                uriAvatar={uriAvatar} 
                rightText={
                  postType === "review"
                    ? " finished reading"
                    : postType === "progress"
                    ? " is reading"
                    : undefined
                }
              />
            </View>

            {book && (
              <View className="mb-2 flex-row flex-wrap items-center">
                <AppText variant="subtitle" numberOfLines={2}>
                  {book.title}
                </AppText>
              </View>
            )}

            <View className="items-start mt-2 mb-2">
              <Rating 
                disabled={true}
                variant="stars-outline"
                size={24}
                rating={userRating}
                spacing={.5}
                baseSymbol={require('@/assets/images/icons/star-line.png')}
                fillSymbol={require('@/assets/images/icons/star-fill.png')}
                baseColor="#71717a"
                fillColor="#FF2D55"
              />
            </View>
          </View>

          {book && (
            <View className="justify-start pt-1 pl-0.5 relative">
              <BookItem book={book} className="w-24 h-36" />
              {postType === "progress" && progress !== undefined && (
                <View 
                  className="absolute px-2 py-1 rounded-2xl shadow-sm z-10"
                  style={{ 
                    top: 12, 
                    left: -18, 
                    backgroundColor: '#B1D5AD',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 3
                  }}
                >
                  <AppText variant="caption" style={{ color: '#1f2937' }}>
                    {progress}%
                  </AppText>
                </View>
              )}
            </View>
          )}
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

export default ReviewCard;