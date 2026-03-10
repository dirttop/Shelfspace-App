import DropdownButton from "@/components/button/DropdownButton";
import ReviewCard from "@/components/card/ReviewCard";
import { Book } from "@/types/book";
import { useState } from "react";
import { View } from "react-native";
import Icons from '@/components/common/Icons';

const mockBook: Book = {
    isbn: "9780765326355",
    title: "The Way of Kings",
    authors: ["Brandon Sanderson"],
    description: "An epic fantasy novel...",
    publisher: "Tor Books",
    pageCount: 1007,
    source: "Google Books",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780765326355-L.jpg", 
    releaseYear: "2010",
};

export default function Home() {
  const [selectedFilter, setSelectedFilter] = useState('Following');

  const navItems = [
    { label: 'ShelfSpace', onPress: () => setSelectedFilter('ShelfSpace'), selected: selectedFilter === 'ShelfSpace' },
    { label: 'Following', onPress: () => setSelectedFilter('Following'), selected: selectedFilter === 'Following' },
    { label: 'Favorites', onPress: () => setSelectedFilter('Favorites'), selected: selectedFilter === 'Favorites' },
    { label: 'Manage favorites', onPress: () => console.log('Manage'), separatorBefore: true },
  ];

  return (
    <View className="flex-1 bg-background p-4 pt-12">
      <View className="flex-row items-center mt-6 mb-6 z-20">
        <Icons.logo color="#000" className="mr-2"/>
        <DropdownButton
          title={selectedFilter}
          dropdownItems={navItems}
          variant="outline"
          size="md"
          dropdownPosition="right"
        />
      </View>

      <ReviewCard 
        book={mockBook} 
        postText="This is a sample review! We love reviews!"
        firstName="John"
        lastName="Doe"
        username="johndoe"
        postType="progress"
        progress={50}
      />
    </View>
  );
}