import { supabase } from "@/app/lib/supabase";
import ProfileCard from "@/components/card/ProfileCard";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Profile() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TabItem["id"]>("books");
  const [flatListData, setFlatListData] = useState<any[]>([]);

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

  // build flatListData whenever activeTab changes
  useEffect(() => {
    if (activeTab === "books") {
      // chunk into rows of 3
      const chunks = chunkData(BOOKS_DATA, 3);
      setFlatListData(chunks);
    } else {
      // social - each post as its own row
      const socialRows = SOCIAL_DATA.map((s) => ({ id: s.id, type: "social" }));
      setFlatListData(socialRows);
    }
  }, [activeTab]);

  function renderItem({ item }: { item: any }) {
    if (item.type === "book-row") {
      return <BookRow items={item.items} />;
    }
    return <SocialPostItem />;
  }

  const ListHeader = () => (
    <>
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

      <View className="mt-4 bg-white px-4 py-2 border-b border-slate-100">
        <View className="flex-row justify-around">
          {PROFILE_TABS.map((tab) => (
            <Pressable
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              className={`px-3 py-2 ${activeTab === tab.id ? "bg-zinc-900 rounded-md" : ""}`}
            >
              <MaterialCommunityIcons
                name={tab.icon as any}
                size={20}
                color={activeTab === tab.id ? "#fff" : "#64748b"}
              />
            </Pressable>
          ))}
        </View>
      </View>
    </>
  );

  const ListEmpty = () => (
    <View className="py-20 items-center">
      <Text className="text-sm text-zinc-500">No items yet</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1"
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      {loading ? (
        <View
          className="flex-1 justify-center items-center"
          style={{ paddingTop: insets.top }}
        >
          <ActivityIndicator />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
