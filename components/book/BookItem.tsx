import { Book } from "@/types/book";
import { cssInterop } from "nativewind";
import { PressableScale } from 'pressto';
import React from "react";
import { Image, View } from "react-native";

const StyledPressable = cssInterop(PressableScale, {
  className: "style",
});

type BookItemProps = {
    book: Book;
    onPress: () => void;
};

const BookItem = ({ book, onPress }: BookItemProps) => {
  return (
    <StyledPressable 
      onPress={onPress}
      className="w-36 m-2 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:bg-gray-800 dark:border-gray-700" 
    >
        <View className="flex-1 w-full">
            <Image 
                source={{ uri: book.coverImage || 'https://via.placeholder.com/150x220.png?text=No+Cover' }} 
                className="w-full h-52 bg-gray-200 dark:bg-gray-700" 
                resizeMode="cover"
            />
        </View>
    </StyledPressable>
  );
};

export default BookItem;