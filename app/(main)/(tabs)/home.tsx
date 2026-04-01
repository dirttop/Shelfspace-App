import DropdownButton from "@/components/button/DropdownButton";
import ReviewCard from "@/components/card/ReviewCard";
import { Book } from "@/types/book";
import React, { useState, useEffect , useCallback, useRef } from "react";
import { View, FlatList } from "react-native";
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
import AppText from "@/components/common/AppText";
import { useRouter, useFocusEffect } from "expo-router";
import { Feather } from "@expo/vector-icons";

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
  const [posts, setPosts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [hasFriends, setHasFriends] = useState(false);

  const fetchNotificationCount = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;
      
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('receiverId', userData.user.id);
        
      if (!error && count !== null) {
        setNotificationCount(count);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotificationCount();
    }, [])
  );

  const fetchPosts = async () => {
    try {
      // Fetch current user id for ownership checks and friend querying
      const { data: userData } = await supabase.auth.getUser();
      const currentId = userData?.user?.id;
      if (currentId) setCurrentUserId(currentId);

      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      const twoWeeksAgoISO = twoWeeksAgo.toISOString();

      let query = supabase
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
        .gte('created_at', twoWeeksAgoISO)
        .order('created_at', { ascending: false });

      if (selectedFilter === 'Friends') {
        if (!currentId) {
          setPosts([]);
          return;
        }

        const { data: friendsData, error: friendsError } = await supabase
          .from('friends')
          .select('user_id, friend_id')
          .eq('status', 'accepted')
          .or(`user_id.eq.${currentId},friend_id.eq.${currentId}`);

        if (friendsError) throw friendsError;

        const friendIds = friendsData ? friendsData.map(f => f.user_id === currentId ? f.friend_id : f.user_id) : [];
        setHasFriends(friendIds.length > 0);

        if (friendIds.length > 0) {
          query = query.in('userId', friendIds);
        } else {
          setPosts([]);
          return;
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      setPosts(data || []);

    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    }
  };

  useEffect(() => {
    if (selectedFilter === 'Friends') {
      fetchPosts();
    }
  }, [selectedFilter]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };



  const handleAddPress = () => {
    addButtonRef.current?.measureInWindow((x, y, width, height) => {
      setAddMenuCoords({
        top: y + height + 8,
        right: 16,
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
          <Icons.logo width={100} height={100} color="#73BDA8" />
          <AppText variant="title" className="text-4xl pb-2">
            Space
          </AppText>
        </View>

        <View className="flex-row items-center justify-end">
          <View className="justify-end relative">
            <IconButton
              icon="bellFill"
              color="#333333"
              onPress={handleBellPress}
              size="lg"
            />
            {notificationCount > 0 && (
              <View className="absolute top-2 right-3 z-10 pointer-events-none">
                <AppText 
                  className="text-[14px] font-sans-bold leading-none"
                  style={{ color: '#73BDA8' }}
                >
                  {notificationCount > 99 ? '99+' : notificationCount}
                </AppText>
              </View>
            )}
          </View>
          <View ref={addButtonRef} className="justify-end">
            <IconButton
              icon="add"
              color="#333333"
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

      <View className="flex-1 bg-[#F2F0E9] relative z-10">
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
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center mt-20 px-4">
                {hasFriends ? (
                  <>
                    <AppText variant="title" className="text-[#333333] mb-1">No posts</AppText>
                    <AppText variant="body" className="text-gray-500 text-center">You're all caught up!</AppText>
                  </>
                ) : (
                  <>
                    <AppText variant="subtitle" className="text-[#333333]">No posts yet.</AppText>
                    <AppText variant="body" className="text-[#333333] mt-2">
                      <AppText 
                        variant="body" 
                        className="text-[#73BDA8] underline" 
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
            <Feather name="package" size={28} color="#73BDA8" style={{ marginTop: 16 }} />
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