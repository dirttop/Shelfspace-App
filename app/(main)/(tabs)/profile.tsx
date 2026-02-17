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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
