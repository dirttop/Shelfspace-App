import React from "react";
import { View, ViewProps } from "react-native";
import IconButton from "../button/IconButton";

import AppText from "../common/AppText";

interface CardActionsProps extends ViewProps {
  isLiked: boolean;
  likesCount?: number;
  commentsCount?: number;
  onLikePress: () => void;
  onCommentPress?: () => void;
  onSharePress?: () => void;
}

const CardActions = ({ 
  isLiked, 
  likesCount = 0,
  commentsCount = 0,
  onLikePress, 
  onCommentPress, 
  onSharePress, 
  className = "", 
  ...props 
}: CardActionsProps) => {
  return (
    <View className={`flex-row items-center -ml-2 -mb-2 ${className}`} {...props}>
      <View className="flex-row items-center mr-2">
        <IconButton
          icon="heartOutline"
          toggledIcon="heartFill"
          toggledColor="red"
          isToggled={isLiked}
          onPress={onLikePress}
          size="sm"
        />
        <AppText variant="caption" className="-ml-1 mr-2 text-slate-500">{likesCount}</AppText>
      </View>

      <View className="flex-row items-center mr-2">
        <IconButton
          icon="commentOutline"
          pressedIcon="commentFill"
          pressedColor="blue"
          onPress={onCommentPress || (() => {})}
          size="sm"
          className="-ml-2"
        />
        <AppText variant="caption" className="-ml-1 mr-2 text-slate-500">{commentsCount}</AppText>
      </View>

      <IconButton
        icon="shareOutline"
        pressedIcon="shareFill"
        pressedColor="blue"
        onPress={onSharePress || (() => {})}
        size="sm"
        className="-ml-2"
      />
    </View>
  );
};

export default CardActions;
