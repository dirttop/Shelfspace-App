import { Book } from "@/types/book";
import { cssInterop } from "nativewind";
import { PressableScale } from 'pressto';
import React from "react";
import { Image } from "react-native";

const StyledPressable = cssInterop(PressableScale, {
  className: "style",
});

type BookItemProps = {
    book: Book;
    onPress: () => void;
    className?: string;
};

const BookItem = ({ book, onPress, className = "" }: BookItemProps) => {
  return (
    <StyledPressable 
      onPress={onPress}
      className={`bg-gray-200 rounded-md overflow-hidden border border-gray-300 shadow-sm ${className || 'w-32 h-48'}`} 
    >
        <Image 
            source={{ uri: book.coverImage || 'https://via.placeholder.com/150x220.png?text=No+Cover' }} 
            className="w-full h-full" 
            resizeMode="cover"
        />
    </StyledPressable>
  );
};

export default BookItem;