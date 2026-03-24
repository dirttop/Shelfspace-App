import DropdownButton from "@/components/button/DropdownButton";
import ReviewCard from "@/components/card/ReviewCard";
import { Book } from "@/types/book";
import { useState, useEffect } from "react";
import { View, FlatList, ScrollView } from "react-native";
import { supabase } from '@/app/lib/supabase';
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient";
import Icons from '@/components/common/Icons';
import PostCard from "@/components/card/PostCard";
import IconButton from "@/components/button/IconButton";
import { CreatePostModal } from "@/components/modals/CreatePostModal";
import { CreateReviewModal } from "@/components/modals/CreateReviewModal";
import { SearchBookForReviewModal } from "@/components/modals/SearchBookForReviewModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Dropdown } from "@/components/button/Dropdown";
import { FileText, Star } from "lucide-react-native";
import React, { useCallback, useRef } from "react";
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
  const createPostModalRef = useRef<BottomSheetModal>(null);
  const searchBookModalRef = useRef<BottomSheetModal>(null);
  const createReviewModalRef = useRef<BottomSheetModal>(null);
  const [reviewBook, setReviewBook] = useState<Book | null>(null);
  const [isAddMenuVisible, setIsAddMenuVisible] = useState(false);
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
          books:book_isbn(
            isbn,
            title,
            authors,
            coverImage:cover_image,
            pageCount:page_count
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
    { label: 'Manage favorites', onPress: () => { }, separatorBefore: true },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <View className="flex-row items-center justify-between mb-4 mt-4 ml-2 px-4 z-20">
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
            onPress={() => { }}
            size="lg"
            className="justify-end"
          />
          <IconButton
            icon="add"
            color="#333333"
            onPress={() => setIsAddMenuVisible(true)}
            size="md"
            className="justify-end"
          />
        </View>
      </View>

      <Dropdown
        isVisible={isAddMenuVisible}
        onClose={() => setIsAddMenuVisible(false)}
        position={{ top: 60, right: 16 }}
        items={[
          {
            label: 'Create Post',
            icon: <FileText size={18} color="#000" />,
            onPress: () => {
              setIsAddMenuVisible(false);
              createPostModalRef.current?.present();
            }
          },
          {
            label: 'Create Review',
            icon: <Star size={18} color="#000" />,
            onPress: () => {
              setIsAddMenuVisible(false);
              searchBookModalRef.current?.present();
            }
          },
        ]}
      />

      <View className="flex-row items-center justify-start mb-4 z-20 px-4">
        <DropdownButton
          title={selectedFilter}
          dropdownItems={navItems}
          variant="secondary"
          size="md"
          dropdownPosition="right"
        />
      </View>

      <View className="flex-1 bg-[#F2F0E9] relative z-10">
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'transparent']}
          style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 18, zIndex: 10 }}
          pointerEvents="none"
        />
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={({ item }) => {
            if (item.post_type === 'review') {
              return (
                <ReviewCard
                  key={`review-${item.id}`}
                  postType="review"
                  postId={item.id}
                  currentUserId={currentUserId ?? undefined}
                  userId={item.profiles?.id}
                  firstName={item.profiles?.first_name || "Unknown"}
                  lastName={item.profiles?.last_name || ""}
                  username={item.profiles?.username || "unknown"}
                  uriAvatar={item.profiles?.avatar_url}
                  postText={item.body}
                  userRating={item.rating}
                  timestamp={item.created_at}
                  likesCount={item.postLikes?.[0]?.count || 0}
                  commentsCount={item.comments?.[0]?.count || 0}
                  onDelete={fetchPosts}
                  book={item.books || { isbn: item.book_isbn, title: "Unknown Book" } as any}
                  className="mb-4"
                />
              );
            }

            return (
              <PostCard
                key={`post-${item.id}`}
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
            );
          }}
          refreshing={refreshing}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 16, paddingHorizontal: 16 }}
        />
      </View>

      <CreatePostModal ref={createPostModalRef} onPostCreated={fetchPosts} />
      <SearchBookForReviewModal 
        ref={searchBookModalRef} 
        onBookSelected={(book) => {
          setReviewBook(book);
          // small delay for smooth transition
          setTimeout(() => createReviewModalRef.current?.present(), 100);
        }} 
      />
      <CreateReviewModal 
        ref={createReviewModalRef} 
        selectedBook={reviewBook} 
        onReviewCreated={fetchPosts} 
      />
    </SafeAreaView>
  );
}