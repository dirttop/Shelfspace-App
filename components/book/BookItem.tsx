import { cssInterop } from "nativewind";
import { PressableScale } from 'pressto';
import React from "react";
import { Image, View } from "react-native";
import AppText from "../common/AppText";
import type { Book } from "@/types/book";

const StyledPressable = cssInterop(PressableScale, {
  className: "style",
});

type BookItemProps = {
    book: Book;
    onPress: () => void;
};

const BookItem = ({ book, onPress }: BookItemProps) => {
  if (!book) return null;
  return (
    <StyledPressable onPress={() => onPress()}>
      <View className="items-center">
        <Image
          source={{ uri: book.coverImage }}
          className="w-28 h-40 rounded-lg bg-slate-200"
        />
        <View className="mt-2 w-28">
          <AppText numberOfLines={2} className="text-xs font-semibold text-slate-900">
            {book.title}
          </AppText>
          <AppText numberOfLines={1} className="text-[11px] text-slate-500">
            {book.authors?.join(", ")}
          </AppText>
        </View>
      </View>
    </StyledPressable>
  );
};
export default BookItem;