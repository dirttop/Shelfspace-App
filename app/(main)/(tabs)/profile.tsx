import { supabase } from "@/app/lib/supabase";
import ProfileCard from "@/components/card/ProfileCard";
import BookListRow, { type BookRecord } from "@/components/book/BookListRow";
import AppText from "@/components/common/AppText";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function Profile() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [books, setBooks] = useState<BookRecord[]>([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [booksError, setBooksError] = useState<string | null>(null);

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

  useEffect(() => {
    let mounted = true;

    async function loadBooks() {
      setBooksLoading(true);
      setBooksError(null);

      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userData?.user) {
        if (mounted) setBooksLoading(false);
        return;
      }

      const userId = userData.user.id;

      const { data, error: booksErr } = await supabase
        .from("books")
        .select("id, title, author, cover_url")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (booksErr) {
        if (mounted) setBooksError(booksErr.message);
      } else {
        if (mounted) setBooks((data ?? []) as BookRecord[]);
      }

      if (mounted) setBooksLoading(false);
    }

    loadBooks();
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
            <>
              <ProfileCard
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
              <View className="mt-6">
                <AppText variant="subtitle" className="text-slate-900 mb-2">
                  My Books
                </AppText>
                {booksLoading ? (
                  <View className="py-8 items-center">
                    <ActivityIndicator />
                  </View>
                ) : booksError ? (
                  <View className="py-4">
                    <Text className="text-sm text-red-600">{booksError}</Text>
                  </View>
                ) : (
                  <FlatList
                    data={books}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <BookListRow book={item} onPress={() => {}} />
                    )}
                    scrollEnabled={false}
                    ListEmptyComponent={
                      <Text className="text-sm text-slate-500 py-4">
                        No books yet.
                      </Text>
                    }
                  />
                )}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
