import DropdownButton from "@/components/button/DropdownButton";
import ReviewCard from "@/components/card/ReviewCard";
import { Book } from "@/types/book";
import { useState } from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Icons from '@/components/common/Icons';
import PostCard from "@/components/card/PostCard";
import IconButton from "@/components/button/IconButton";
import AppText from "@/components/common/AppText";

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
    { label: 'Manage favorites', onPress: () => {}, separatorBefore: true },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <View className="flex-row items-center justify-between mb-4 mt-4 ml-2 px-4">
        <View className="flex-row items-center justify-start">
          <AppText variant="title" className="pb-2">
            Shelf
          </AppText>
          <Icons.logo width={100} height={100} color="#000" />
          <AppText variant="title" className="pb-2">
            Space
          </AppText>
        </View>

        <View className="flex-row items-center justify-end">
          <IconButton
            icon="bellFill"
            color="#333333"
            onPress={() => {}}
            size="lg"
            className="justify-end"
          />
          <IconButton
            icon="add"
            color="#333333"
            onPress={() => {}}
            size="xl"
            className="justify-end"
          />
        </View>
      </View>

      <View className="flex-row items-center justify-start mb-6 z-20 px-4">
         <DropdownButton
           title={selectedFilter}
           dropdownItems={navItems}
           variant="secondary"
           size="md"
           dropdownPosition="right"
         />
      </View>

      <View className="flex-1 bg-[#F2F0E9] relative">
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'transparent']}
          style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 18, zIndex: 10 }}
          pointerEvents="none"
        />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24, paddingTop: 16, paddingHorizontal: 16, gap: 16 }}>
          <ReviewCard 
            book={mockBook} 
            postText="This is a sample review! We love reviews!"
            firstName="John"
            lastName="Doe"
            username="johndoe"
            postType="progress"
            progress={50}
          />

          <PostCard
            firstName = "John"
            lastName = "Doe"
            username = "johndoe"
            postText = "This is a sample post!"
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}