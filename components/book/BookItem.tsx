import { cssInterop } from "nativewind";
import { PressableScale } from 'pressto';
import React from "react";
import { Image, View } from "react-native";
import AppText from "../common/AppText";

const StyledPressable = cssInterop(PressableScale, {
  className: "style",
});

type BookItemProps = {
    book: Book;
    onPress: () => void;
};

const BookItem = ({ book, onPress }: BookItemProps) => {
  return (
    <StyledPressable onPress={() => onPress()}>
        <View className={""}>
        <Image source={{ uri: book.coverImage }} className={""} />
        <View className={""}>
            <AppText className={""}>{book.title}</AppText>
            <AppText className={""}>by {book.authors?.join(", ")}</AppText>
        </View>
        </View>
    </StyledPressable>
  );
};
export default BookItem;