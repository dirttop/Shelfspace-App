import DropdownButton from "@/components/button/DropdownButton";
import ReviewCard from "@/components/card/ReviewCard";
import { Book } from "@/types/book";
import { useState, useEffect } from "react";
import { View, FlatList } from "react-native";
import { supabase } from '@/app/lib/supabase';
import Icons from '@/components/common/Icons';
import PostCard from "@/components/card/PostCard";
import IconButton from "@/components/button/IconButton";
import { CreatePostModal } from "@/components/modals/CreatePostModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useCallback, useRef } from "react";

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
  const createPostModalRef = useRef<BottomSheetModal>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!userId(
            id,
            username,
            first_name,
            last_name,
            avatar_url
          ),
          postLikes:postLikes(count),
          comments:comments(count)
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setPosts(data || []);

      // Fetch current user id for ownership checks
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) setCurrentUserId(userData.user.id);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const handlePresentCreatePost = useCallback(() => {
    createPostModalRef.current?.present();
  }, []);

  const navItems = [
    { label: 'ShelfSpace', onPress: () => setSelectedFilter('ShelfSpace'), selected: selectedFilter === 'ShelfSpace' },
    { label: 'Following', onPress: () => setSelectedFilter('Following'), selected: selectedFilter === 'Following' },
    { label: 'Favorites', onPress: () => setSelectedFilter('Favorites'), selected: selectedFilter === 'Favorites' },
    { label: 'Manage favorites', onPress: () => console.log('Manage'), separatorBefore: true },
  ];

  return (
    <View className="flex-1 bg-background p-4 pt-12">
      <View className="flex-row items-center mt-6 mb-6 z-20">
        <View className="flex-row items-center justify-start">
           <DropdownButton
             title={selectedFilter}
             dropdownItems={navItems}
             variant="secondary"
             size="md"
             dropdownPosition="right"
        />
        </View>
        <View className="flex-row items-center justify-end">
          <IconButton
            icon="bellFill"
            color="#333333"
            onPress={() => console.log('Notifications')}
            size="lg"
            className="justify-end"
          />
          <IconButton
            icon="add"
            color="#333333"
            onPress={handlePresentCreatePost}
            size="md"
            className="justify-end"
          />
        </View>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => (
          <PostCard
            key={item.id}
            postId={item.id}
            currentUserId={currentUserId ?? undefined}
            userId={item.profiles?.id}
            firstName={item.profiles?.first_name || "Unknown"}
            lastName={item.profiles?.last_name || ""}
            username={item.profiles?.username || "unknown"}
            uriAvatar={item.profiles?.avatar_url}
            postText={item.body}
            postImage={item.file}
            timestamp={item.created_at}
            likesCount={item.postLikes?.[0]?.count || 0}
            commentsCount={item.comments?.[0]?.count || 0}
            onDelete={fetchPosts}
            className="mb-4"
          />
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <CreatePostModal ref={createPostModalRef} onPostCreated={fetchPosts} />
    </View>
  );
}