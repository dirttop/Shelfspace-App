import { Book } from "@/types/book";
import { Image } from "expo-image";
import { PressableScale } from 'pressto';
import React from "react";
import { View } from "react-native";

type BookItemProps = {
    book: Book;
    onPress: () => void;
    className?: string;
};

const BookItem = ({ book, onPress, className = "" }: BookItemProps) => {
  return (
    <View className={`bg-gray-200 rounded-md overflow-hidden border border-gray-300 shadow-sm ${className || 'w-32 h-48'}`}>
        <PressableScale 
          onPress={onPress}
          style={{ flex: 1, width: '100%', height: '100%' }}
        >
            <Image 
                source={{ uri: book.coverImage || 'https://via.placeholder.com/150x220.png?text=No+Cover' }} 
                className="w-full h-full absolute"
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
                transition={200}
            />
        </PressableScale>
    </View>
  );
};

export default BookItem;