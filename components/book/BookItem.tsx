import { Book } from "@/types/book";
import { Image } from "expo-image";
import React from "react";
import { Platform, Pressable, View } from "react-native";

import { useBookModal } from "@/contexts/BookModalContext";

type BookItemProps = {
    book: Book;
    onPress?: () => void;
    className?: string;
    style?: any;
};

const BookItem = ({ book, onPress, className = "", style }: BookItemProps) => {
  const { openBookModal } = useBookModal();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      openBookModal(book);
    }
  };

  return (
    <View 
      className={`rounded-md ${className || 'w-32 h-48'}`}
      style={[{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
        backgroundColor: Platform.OS === 'android' ? 'white' : 'transparent',
        borderRadius: 6
      }, style]}
    >
      <View className="rounded-md overflow-hidden border border-gray-300 w-full h-full bg-gray-200">
          <Pressable 
            onPress={handlePress}
            className="flex-1 w-full h-full active:scale-95"
            style={{ flex: 1, width: '100%', height: '100%' }}
          >
              <Image 
                  source={{ uri: book.coverImage || 'https://via.placeholder.com/150x220.png?text=No+Cover' }} 
                  className="w-full h-full absolute"
                  style={{ width: '100%', height: '100%', transform: [{ scale: 1.05 }] }}
                  contentFit="cover"
                  contentPosition="center" 
                  transition={200}
              />
          </Pressable>
      </View>
    </View>
  );
};

export default BookItem;