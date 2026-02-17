import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppText from "@/components/common/AppText";
import { Pressable, View } from "react-native";
import { Image } from "expo-image";

export interface BookRecord {
  id: string;
  title: string;
  author?: string | null;
  cover_url?: string | null;
}

interface BookListRowProps {
  book: BookRecord;
  onPress?: () => void;
}

export default function BookListRow({ book, onPress }: BookListRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 py-3 px-1 active:opacity-80"
    >
      <View className="w-12 h-[72px] rounded-lg bg-slate-100 items-center justify-center overflow-hidden">
        {book.cover_url ? (
          <Image
            source={{ uri: book.cover_url }}
            className="w-full h-full"
            contentFit="cover"
          />
        ) : (
          <MaterialCommunityIcons name="book-outline" size={24} color="#94a3b8" />
        )}
      </View>
      <View className="flex-1 min-w-0">
        <AppText numberOfLines={2} className="text-base font-medium text-slate-900">
          {book.title}
        </AppText>
        {book.author ? (
          <AppText numberOfLines={1} className="text-sm text-slate-500 mt-0.5">
            {book.author}
          </AppText>
        ) : null}
      </View>
    </Pressable>
  );
}
