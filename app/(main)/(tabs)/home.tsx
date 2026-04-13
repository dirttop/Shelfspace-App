import { Dropdown } from "@/components/button/Dropdown";
import DropdownButton from "@/components/button/DropdownButton";
import IconButton from "@/components/button/IconButton";
import PostCard from "@/components/card/PostCard";
import ReviewCard from "@/components/card/ReviewCard";
import AppText from "@/components/common/AppText";
import Icons from '@/components/common/Icons';
import { CreatePostModal } from "@/components/modals/CreatePostModal";
import { CreateReviewModal } from "@/components/modals/CreateReviewModal";
import { SearchBookForReviewModal } from "@/components/modals/SearchBookForReviewModal";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { useFeed } from "@/hooks/useFeed";
import { useNotifications } from "@/hooks/useNotifications";
import { Book } from "@/types/book";
import { Feather } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { FileText, Star } from "lucide-react-native";
import React, { useRef, useState } from "react";
import { Dimensions, FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const [selectedFilter, setSelectedFilter] = useState('Friends');
  const createPostModalRef = useRef<BottomSheetModal>(null);
  const searchBookModalRef = useRef<BottomSheetModal>(null);
  const createReviewModalRef = useRef<BottomSheetModal>(null);
  const [reviewBook, setReviewBook] = useState<Book | null>(null);
  const [isAddMenuVisible, setIsAddMenuVisible] = useState(false);
  const [addMenuCoords, setAddMenuCoords] = useState<{ top?: number; right?: number }>({ top: 60, right: 16 });
  const addButtonRef = useRef<View>(null);
  const router = useRouter();
  const { session } = useAuth();
  const currentUserId = session?.user?.id ?? null;
  const { posts, refreshing, refresh: fetchPosts, hasFriends } = useFeed({ 
    filter: selectedFilter, 
    currentUserId 
  });
  const { notificationCount } = useNotifications(currentUserId);

  const onRefresh = async () => {
    await fetchPosts();
  };



  const handleAddPress = () => {
    addButtonRef.current?.measureInWindow((x, y, width, height) => {
      const windowWidth = Dimensions.get('window').width;
      setAddMenuCoords({
        top: y + height,
        right: windowWidth - (x + width),
      });
      setIsAddMenuVisible(true);
    });
  };

  const handleBellPress = () => {
    router.push('/notifications');
  };

  const navItems = [
    { label: 'Friends', onPress: () => setSelectedFilter('Friends'), selected: selectedFilter === 'Friends' },
    { label: 'Followed Tags', onPress: () => setSelectedFilter('Followed Tags'), selected: selectedFilter === 'Followed Tags' },
    { label: 'For You', onPress: () => setSelectedFilter('For You'), selected: selectedFilter === 'For You' }
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <View className="flex-row items-center justify-between mb-4 mt-4 ml-2 px-4 z-20">
        <View className="flex-row items-center justify-start">
          <AppText variant="title" className="text-4xl pb-2">
            Shelf
          </AppText>
          <Icons.logo width={100} height={100} color={Colors.primary} />
          <AppText variant="title" className="text-4xl pb-2">
            Space
          </AppText>
        </View>

        <View className="flex-row items-center justify-end">
          <View className="justify-end relative">
            <IconButton
              icon="bellFill"
              color={Colors.foreground}
              onPress={handleBellPress}
              size="lg"
            />
            {notificationCount > 0 && (
              <View className="absolute top-2 right-3 z-10 pointer-events-none">
                <AppText 
                  className="text-[14px] font-sans-bold leading-none text-primary"
                >
                  {notificationCount > 99 ? '99+' : notificationCount}
                </AppText>
              </View>
            )}
          </View>
          <View ref={addButtonRef} className="justify-end">
            <IconButton
              icon="add"
              color={Colors.foreground}
              onPress={handleAddPress}
              size="xl"
            />
          </View>
        </View>
      </View>

      <Dropdown
        isVisible={isAddMenuVisible}
        onClose={() => setIsAddMenuVisible(false)}
        position={addMenuCoords}
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
          buttonMaxWidth="50%"
          dropdownMaxWidth="50%"
          className="self-start"
        />
      </View>

      <View className="flex-1 bg-background relative z-10">
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'transparent']}
          style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 18, zIndex: 10 }}
          pointerEvents="none"
        />
        {selectedFilter === 'Friends' ? (
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
                    isLiked={item.isLiked}
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
                  isLiked={item.isLiked}
                  className="mb-4"
                />
              );
            }}
            refreshing={refreshing}
            onRefresh={onRefresh}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100, paddingTop: 16, paddingHorizontal: 16 }}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center mt-20 px-4">
                {hasFriends ? (
                  <>
                    <AppText variant="title" className="text-foreground mb-1">No posts</AppText>
                    <AppText variant="body" className="text-gray-500 text-center">You're all caught up!</AppText>
                  </>
                ) : (
                  <>
                    <AppText variant="subtitle" className="text-foreground">No posts yet.</AppText>
                    <AppText variant="body" className="text-foreground mt-2">
                      <AppText 
                        variant="body" 
                        className="text-primary underline" 
                        onPress={() => router.push({ pathname: '/search', params: { tab: 'users' } })}
                      >
                        Connect
                      </AppText>
                      {' '}with your friends to see their posts
                    </AppText>
                  </>
                )}
              </View>
            }
          />
        ) : (
          <View className="flex-1 items-center justify-center pt-20">
            <AppText variant="title">Under Construction</AppText>
            <Feather name="package" size={28} color={Colors.primary} style={{ marginTop: 16 }} />
          </View>
        )}
      </View>

      <CreatePostModal ref={createPostModalRef} onPostCreated={fetchPosts} />
      <SearchBookForReviewModal 
        ref={searchBookModalRef} 
        onBookSelected={(book) => {
          setReviewBook(book);
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