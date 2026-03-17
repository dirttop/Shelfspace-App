import React from "react";
import { View, ViewProps } from "react-native";
import IconButton from "../button/IconButton";

interface CardActionsProps extends ViewProps {
  isLiked: boolean;
  onLikePress: () => void;
  onCommentPress?: () => void;
  onSharePress?: () => void;
}

const CardActions = ({ 
  isLiked, 
  onLikePress, 
  onCommentPress, 
  onSharePress, 
  className = "", 
  ...props 
}: CardActionsProps) => {
  return (
    <View className={`flex-row items-center -ml-2 -mb-2 ${className}`} {...props}>
      <IconButton
        icon="heartOutline"
        toggledIcon="heartFill"
        toggledColor="red"
        isToggled={isLiked}
        onPress={onLikePress}
        size="sm"
      />
      <IconButton
        icon="commentOutline"
        pressedIcon="commentFill"
        pressedColor="blue"
        onPress={onCommentPress || (() => {})}
        size="sm"
        className="-ml-2"
      />
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
