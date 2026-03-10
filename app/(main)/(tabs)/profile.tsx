import { supabase } from "@/app/lib/supabase";
import BookItem from "@/components/book/BookItem";
import ProfileCard from "@/components/card/ProfileCard";
import AppText from "@/components/common/AppText";
import type { Book } from "@/types/book";
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

// Remove this fake data after testing is complete
const USE_MOCK_BOOKS = true;

const mockBooks: Book[] = [
  {
    title: "The Midnight Library",
    authors: ["Matt Haig"],
    description: "Between life and death there is a library.",
    coverImage:
      "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg?auto=compress&cs=tinysrgb&w=400",
    pageCount: 304,
    publisher: "Canongate",
    isbn: "9780525559474",
    source: "Cache",
  },
  {
    title: "Project Hail Mary",
    authors: ["Andy Weir"],
    description: "A lone astronaut must save the earth.",
    coverImage:
      "https://images.pexels.com/photos/256450/pexels-photo-256450.jpeg?auto=compress&cs=tinysrgb&w=400",
    pageCount: 496,
    publisher: "Ballantine Books",
    isbn: "9780593135204",
    source: "Cache",
  },
  {
    title: "The Song of Achilles",
    authors: ["Madeline Miller"],
    description: "A retelling of the legend of Achilles.",
    coverImage:
      "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg?auto=compress&cs=tinysrgb&w=400",
    pageCount: 378,
    publisher: "Ecco",
    isbn: "9780062060624",
    source: "Cache",
  },
  {
    title: "Atomic Habits",
    authors: ["James Clear"],
    description: "Tiny changes, remarkable results.",
    coverImage:
      "https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&cs=tinysrgb&w=400",
    pageCount: 320,
    publisher: "Avery",
    isbn: "9780735211292",
    source: "Cache",
  },
  {
    title: "Circe",
    authors: ["Madeline Miller"],
    description: "The story of the witch of Aiaia.",
    coverImage:
      "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg?auto=compress&cs=tinysrgb&w=400",
    pageCount: 400,
    publisher: "Little, Brown and Company",
    isbn: "9780316556347",
    source: "Cache",
  },
];
//end of fake data

export default function Profile() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
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
//remove this if statement after testing is complete
      if (USE_MOCK_BOOKS) {
        if (mounted) {
          setBooks(mockBooks);
          setBooksLoading(false);
        }
        return;
      }

// delete this after testing mock book data 
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
        const rows = (data ?? []) as { id: string; title: string; author?: string | null; cover_url?: string | null }[];
        if (mounted) {
          setBooks(
            rows.map((row) => ({
              title: row.title,
              authors: row.author ? [row.author] : [],
              description: "",
              coverImage: row.cover_url ?? undefined,
              source: "Cache" as const,
            }))
          );
        }
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
                    numColumns={2}
                    keyExtractor={(item, index) => `${item.title}-${index}`}
                    columnWrapperStyle={{ flexDirection: "row", gap: 12, marginBottom: 12 }}
                    contentContainerStyle={{ gap: 12 }}
                    renderItem={({ item }) => (
                      <View className="flex-1 min-w-0">
                        <BookItem book={item} onPress={() => {}} />
                      </View>
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
