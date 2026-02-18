import BookItem from "@/components/book/BookItem";
import { Book } from "@/types/book";
import { View } from "react-native";

const mockBook: Book = {
    isbn: "9780765326355",
    title: "The Way of Kings",
    authors: ["Brandon Sanderson"],
    description: "An epic fantasy novel...",
    publisher: "Tor Books",
    pageCount: 1007,
    source: "Google Books",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780765326355-L.jpg", 
};

export default function Home() {
  return (
    <View className="flex-1 bg-gray-50 items-center justify-center">
      <BookItem 
        book={mockBook} 
        onPress={() => console.log("Book pressed! Navigate to details.")} 
      />
    </View>
  );
}