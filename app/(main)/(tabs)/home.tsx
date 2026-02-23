import ReviewCard from "@/components/card/ReviewCard";
import AppText from "@/components/common/AppText";
import { Dropdown } from "@/components/modals/Dropdown";
import { Book } from "@/types/book";
import { useState } from "react";
import { Pressable, View } from "react-native";

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
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Following');

  const navItems = [
    { label: 'Home', onPress: () => setSelectedFilter('Home'), selected: selectedFilter === 'Home' },
    { label: 'Following', onPress: () => setSelectedFilter('Following'), selected: selectedFilter === 'Following' },
    { label: 'Favorites', onPress: () => setSelectedFilter('Favorites'), selected: selectedFilter === 'Favorites' },
    { label: 'Manage favorites', onPress: () => console.log('Manage'), separatorBefore: true },
  ];

  return (
    <View className="flex-1 bg-gray-50 p-4 pt-12">
      <View className="flex-row items-center mb-6 z-20">
        <Pressable 
          onPress={() => setDropdownVisible(true)}
          className="flex-row items-center px-4 py-2 bg-white rounded-lg shadow-sm"
        >
          <AppText className="text-xl font-bold">Home</AppText>
        </Pressable>
      </View>

      <Dropdown
        isVisible={dropdownVisible}
        onClose={() => setDropdownVisible(false)}
        items={navItems}
        position={{ top: 90, left: 16 }} // Anchored right below the button
      />

      <ReviewCard 
        book={mockBook} 
        postText="This is a sample review! We love reviews!"
        firstName="John"
        lastName="Doe"
        username="johndoe"
      />
    </View>
  );
}