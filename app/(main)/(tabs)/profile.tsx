import { supabase } from "@/app/lib/supabase";
import DropdownButton from "@/components/button/DropdownButton";
import ProfileCard from "@/components/card/ProfileCard";
import ProfileBookList from "@/components/profile/ProfileBookList";
import PostCard from "@/components/card/PostCard";
import ReviewCard from "@/components/card/ReviewCard";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { CustomizeShelvesModal } from '@/components/modals/CustomizeShelvesModal';
import AppText from "@/components/common/AppText";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  View,
  RefreshControl,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  Animated
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TabBar } from 'react-native-tab-view';

export default function Profile() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any | null>(null);
  const [shelves, setShelves] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [readCount, setReadCount] = useState<number>(0);
  const [readingCount, setReadingCount] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);

  const customizeModalRef = useRef<BottomSheetModal>(null);

  // Tab State
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'shelves', title: 'Shelves' },
    { key: 'posts', title: 'Posts' },
  ]);
  const position = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(position, {
      toValue: index,
      useNativeDriver: true,
      bounciness: 0,
    }).start();
  }, [index]);

  const fetchPosts = async (userId: string) => {
    setLoadingPosts(true);
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select(`
        *,
        profiles!userId(id, username, first_name, last_name, avatar_url),
        books:book_isbn(isbn, title, authors, coverImage:cover_image, pageCount:page_count),
        postLikes:postLikes(count),
        comments:comments(count)
      `)
      .eq('userId', userId)
      .order('created_at', { ascending: false });

    if (!postsError && postsData) {
      setPosts(postsData);
    } else {
      console.error("Failed to fetch posts:", postsError);
    }
    setLoadingPosts(false);
  };

  const fetchData = async () => {
    setError(null);
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user) {
      setError(userErr?.message ?? "Not signed in");
      return;
    }
    const userId = userData.user.id;

    const { data: profileData, error: profileErr } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, username, bio, avatar_url, read_count, reading_count, shelved_count, post_count, friend_count, follow_count")
      .eq("id", userId)
      .single();

    if (profileErr) {
      setError(profileErr.message);
    } else {
      setProfile(profileData ?? null);
      fetchPosts(userId);
    }

    const { data: shelvesData, error: shelvesErr } = await supabase
      .from("shelves")
      .select("id, name, created_at, display_on_profile")
      .eq("user_id", userId);

    if (shelvesErr) {
      setError(shelvesErr.message);
    } else {
      setShelves(shelvesData ?? []);

      let computedReadCount = 0;
      let computedReadingCount = 0;

      if (shelvesData) {
        const readShelf = shelvesData.find(s => s.name?.toLowerCase() === 'read');
        const readingShelf = shelvesData.find(s => s.name?.toLowerCase() === 'reading');

        if (readShelf) {
          const { count } = await supabase.from('shelfBooks').select('*', { count: 'exact', head: true }).eq('shelf_id', readShelf.id);
          computedReadCount = count || 0;
        }
        if (readingShelf) {
          const { count } = await supabase.from('shelfBooks').select('*', { count: 'exact', head: true }).eq('shelf_id', readingShelf.id);
          computedReadingCount = count || 0;
        }
      }

      setReadCount(computedReadCount);
      setReadingCount(computedReadingCount);

      if (profileData && (profileData.read_count !== computedReadCount || profileData.reading_count !== computedReadingCount)) {
        try {
          await supabase.from("profiles").update({ read_count: computedReadCount, reading_count: computedReadingCount }).eq("id", userId);
        } catch (syncErr) { }
      }
    }
  };

  useEffect(() => {
    let mounted = true;
    const loadInitialData = async () => {
      setLoading(true);
      await fetchData();
      if (mounted) setLoading(false);
    };
    loadInitialData();
    return () => { mounted = false; };
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

  const renderTabBar = (props: any) => (
    <View className="bg-white border-b border-slate-200" style={{ marginHorizontal: 16 }}>
      <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: '#27272a' }}
        style={{ backgroundColor: 'transparent', elevation: 0, shadowOffset: { height: 0, width: 0 } }}
        tabStyle={{ minHeight: 48, paddingVertical: 12 }}
        activeColor="#18181b"
        inactiveColor="#71717a"
        renderLabel={({ route, focused, color }: { route: { title: string }, focused: boolean, color: string }) => (
          <AppText style={{ color }} className={focused ? "font-fraunces-bold" : ""}>
            {route.title}
          </AppText>
        )}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-background"
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      {loading ? (
        <View className="flex-1 justify-center items-center" style={{ paddingTop: insets.top }}>
          <ActivityIndicator />
        </View>
      ) : (
        <View className="flex-1" style={{ paddingTop: insets.top }}>
          <FlatList
            data={index === 0 ? shelves.filter(s => s.display_on_profile) : posts}
            keyExtractor={(item, idx) => item?.id ? item.id.toString() : idx.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListHeaderComponent={() => (
              <View className="bg-white">
                <ProfileCard
                  className="mt-5 mx-4"
                  firstName={profile?.first_name}
                  lastName={profile?.last_name}
                  username={profile?.username}
                  bio={profile?.bio}
                  uriAvatar={profile?.avatar_url}
                  readCount={profile?.read_count || 0}
                  readingCount={profile?.reading_count || 0}
                  shelvedCount={profile?.shelved_count}
                  postCount={profile?.post_count}
                  friendCount={profile?.friend_count}
                  followCount={profile?.follow_count}
                />

                {renderTabBar({
                  navigationState: { index, routes },
                  position: position,
                  jumpTo: (key: string) => setIndex(routes.findIndex(r => r.key === key)),
                  layout: { width: layout.width - 32, height: 0 }
                })}

                {index === 0 && (
                  <View className="flex-row justify-between items-center px-4 mt-2 mb-2">
                    <TouchableOpacity
                      onPress={() => customizeModalRef.current?.present()}
                      className="px-4 py-2 border border-slate-200 rounded-lg bg-white shadow-sm flex-row items-center"
                    >
                      <AppText variant="caption" className="font-fraunces-semiBold text-slate-700">Customize Shelves</AppText>
                    </TouchableOpacity>
                  </View>
                )}
                {index === 1 && <View className="h-4" />}
              </View>
            )}
            renderItem={({ item }) => {
              if (index === 0) {
                return (
                  <View className="bg-[#F2F0E9] pt-2 relative">
                    <ProfileBookList
                      key={item.id}
                      userId={profile.id}
                      shelfId={item.id}
                      title={item.name}
                    />
                  </View>
                );
              } else {
                return (
                  <View className="bg-[#F2F0E9]">
                    {item.post_type === 'review' ? (
                      <ReviewCard
                        postId={item.id}
                        currentUserId={profile?.id}
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
                        onDelete={() => fetchPosts(profile.id)}
                        book={item.books || { isbn: item.book_isbn, title: "Unknown Book" } as any}
                        className="mb-4 mx-4 mt-2"
                      />
                    ) : (
                      <PostCard
                        postId={item.id}
                        currentUserId={profile?.id}
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
                        onDelete={() => fetchPosts(profile.id)}
                        className="mb-4 mx-4 mt-2"
                      />
                    )}
                  </View>
                );
              }
            }}
            ListEmptyComponent={() => (
              <View className="items-center justify-center p-8 opacity-50 bg-[#F2F0E9] flex-1">
                {index === 0
                  ? <AppText variant="body" className="text-center">No shelves displayed. Tap Customize Shelves to select carousels.</AppText>
                  : loadingPosts
                    ? <ActivityIndicator />
                    : <AppText variant="body" className="text-center">No posts yet.</AppText>
                }
              </View>
            )}
            style={{ backgroundColor: '#F2F0E9' }}
          />

          <CustomizeShelvesModal
            ref={customizeModalRef}
            userId={profile?.id}
            onShelvesUpdated={fetchData}
          />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
