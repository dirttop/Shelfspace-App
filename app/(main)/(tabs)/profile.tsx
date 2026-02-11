import ProfileCard from "@/components/card/ProfileCard";
import AppText from "@/components/common/AppText";
import Tabs, { TabItem } from '@/components/common/Tabs';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { cssInterop } from 'nativewind';
import { PressableScale } from 'pressto';

cssInterop(PressableScale, {
  className: "style",
});

const PROFILE_TABS: TabItem[] = [
  { id: 'books', icon: 'book' }, 
  { id: 'social', icon: 'account-group' } 
];

const BOOKS_DATA = Array.from({ length: 12 }, (_, i) => ({ id: `book-${i}` }));
const SOCIAL_DATA = Array.from({ length: 8 }, (_, i) => ({ id: `post-${i}` }));



const BookItem = () => (
    // @ts-ignore
    <PressableScale className="flex-1 aspect-[2/3] m-0.5 bg-slate-100 rounded-lg items-center justify-center" onPress={() => console.log('Book pressed')}>
      <MaterialCommunityIcons name="book-outline" size={28} color="#94a3b8" />
    </PressableScale>
);

const BookRow = ({ items }: { items: any[] }) => (
    <View className="flex-row px-0.5">
        {items.map((item) => (
            <BookItem key={item.id} />
        ))}
        {Array.from({ length: 3 - items.length }).map((_, i) => (
             <View key={`empty-${i}`} className="flex-1 m-0.5" />
        ))}
    </View>
);

const SocialPostItem = () => (
  <View className="mx-4 mb-3 p-4 bg-white rounded-xl border border-slate-100">
    <View className="flex-row items-center mb-3">
      <View className="w-8 h-8 rounded-full bg-slate-200 mr-3" />
      <View>
        <AppText className="text-sm font-semibold text-slate-900">username</AppText>
        <AppText className="text-xs text-slate-400">2h ago</AppText>
      </View>
    </View>
    <AppText className="text-sm text-slate-600 leading-5">
      This is a mock post.
    </AppText>
  </View>
);

const chunkData = (data: any[], size: number) => {
    const chunks = [];
    for (let i = 0; i < data.length; i += size) {
        chunks.push({ 
            id: `row-${i}`, 
            type: 'book-row', 
            items: data.slice(i, i + size) 
        });
    }
    return chunks;
};

export default function Profile() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('books');
  const flatListData = useMemo(() => {
      const content = activeTab === 'books' 
        ? chunkData(BOOKS_DATA, 3) 
        : SOCIAL_DATA.map(item => ({ ...item, type: 'social-post' }));
      
      return [
          { id: 'tabs-sticky', type: 'tabs' },
          ...content
      ];
  }, [activeTab]);

  const renderItem = useCallback(({ item }: { item: any }) => {
      if (item.type === 'tabs') {
          return (
            <Tabs 
                items={PROFILE_TABS} 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
            />
          );
      }
      if (item.type === 'book-row') {
          return <BookRow items={item.items} />;
      }
      if (item.type === 'social-post') {
          return <SocialPostItem />;
      }
      return null;
  }, [activeTab]);

  const ListHeader = useCallback(() => (
    <View className="px-4 pt-2 pb-4 bg-white">
      <ProfileCard
        fullName="John Smith"
        username="johnsmith418"
        bio="This is a mock bio. I will now type to make it longer to test the wrapping. I will now type to make it longer to test the wrapping."
        readCount={42}
        readingCount={3}
        shelvedCount={17}
      />
    </View>
  ), []);

  const ListEmpty = useCallback(() => {
      if (flatListData.length > 1) return null;
      
      return (
        <View className="flex-1 items-center justify-center py-20">
          <MaterialCommunityIcons 
            name={activeTab === 'books' ? 'bookshelf' : 'account-group-outline'} 
            size={48} 
            color="#cbd5e1" 
          />
          <AppText className="text-slate-400 mt-3">
            {activeTab === 'books' ? 'No books yet' : 'No posts yet'}
          </AppText>
        </View>
      );
  }, [activeTab, flatListData.length]);

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
      <FlatList
        data={flatListData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        
        ListHeaderComponent={ListHeader}
        stickyHeaderIndices={[1]} 
        
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
      />
    </View>
  );
}