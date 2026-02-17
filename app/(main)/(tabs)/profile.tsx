import { supabase } from "@/app/lib/supabase";
import ProfileCard from "@/components/card/ProfileCard";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
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
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      setLoading(true);
      setError(null);

      // Get current authenticated user
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userData?.user) {
        if (mounted) setError(userErr?.message ?? "Not signed in");
        if (mounted) setLoading(false);
        return;
      }

      const userId = userData.user.id;

      // Fetch profile row from 'profiles' table
      const { data, error: profileErr } = await supabase
        .from("profiles")
        .select(
          "first_name, last_name, username, bio, avatar_url, read_count, reading_count, shelved_count, post_count, friend_count, follow_count",
        )
        .eq("id", userId)
        .single();

      if (profileErr) {
        if (mounted) setError(profileErr.message);
      } else {
        if (mounted) setProfile(data ?? null);
      }

      if (mounted) setLoading(false);
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1"
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        contentContainerClassName="flex-grow  p-5"
        contentContainerStyle={{
          paddingBottom: 20 + insets.bottom, //easier to read than inline
          paddingTop: insets.top,
        }}
        className="flex-1"
      >
        <View>
          {loading ? (
            <View className="items-center justify-center py-20">
              <ActivityIndicator />
            </View>
          ) : error ? (
            <View className="py-20 items-center">
              <Text className="text-center text-sm text-red-600">{error}</Text>
            </View>
          ) : (
            <ProfileCard
              className="mt-5"
              firstName={profile?.first_name}
              lastName={profile?.last_name}
              username={profile?.username}
              bio={profile?.bio}
              uriAvatar={profile?.avatar_url}
              readCount={profile?.read_count}
              readingCount={profile?.reading_count}
              shelvedCount={profile?.shelved_count}
              postCount={profile?.post_count}
              friendCount={profile?.friend_count}
              followCount={profile?.follow_count}
            />
          )}
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
