import { supabase } from "@/app/lib/supabase";
import DropdownButton from "@/components/button/DropdownButton";
import ProfileCard from "@/components/card/ProfileCard";
import ProfileBookList from "@/components/profile/ProfileBookList";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Profile() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any | null>(null);
  const [shelves, setShelves] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedShelfId, setSelectedShelfId] = useState<number | null>(null);

  const shelfOptions = shelves.map(shelf => ({
    label: shelf.name,
    onPress: () => setSelectedShelfId(shelf.id),
  }));

  useEffect(() => {
    if (shelves.length > 0) {
      setSelectedShelfId(shelves[0].id);
    }
  }, [shelves]);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      setLoading(true);
      setError(null);

      // get current user
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userData?.user) {
        if (mounted) setError(userErr?.message ?? "Not signed in");
        if (mounted) setLoading(false);
        return;
      }

      const userId = userData.user.id;

      // fetch profile data
      const { data: profileData, error: profileErr } = await supabase
        .from("profiles")
        .select(
          "id, first_name, last_name, username, bio, avatar_url, read_count, reading_count, shelved_count, post_count, friend_count, follow_count",
        )
        .eq("id", userId)
        .single();

      if (profileErr) {
        if (mounted) setError(profileErr.message);
      } else {
        if (mounted) setProfile(profileData ?? null);
      }

      // fetch shelves data
      const { data: shelvesData, error: shelvesErr } = await supabase
        .from("shelves")
        .select(
          "id, name, created_at, updated_at",
        )
        .eq("user_id", userId);

      if (shelvesErr) {
        if (mounted) setError(shelvesErr.message);
      } else {
        if (mounted) setShelves(shelvesData ?? []);
      }

      if (mounted) setLoading(false);
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-white"
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      {loading ? (
        <View
          className="flex-1 justify-center items-center"
          style={{ paddingTop: insets.top }}
        >
          <ActivityIndicator />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          style={{ paddingTop: insets.top }}
        >

          <ProfileCard
            className="mt-5 mx-4"
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

          <View className="mt-2 px-4 items-start">
            <DropdownButton
              title="Add to Shelf"
              dropdownItems={shelfOptions}
              variant="outline"
              size="sm"
              dropdownPosition="right"
            />
          </View>

          <View className="mt-4">
            {profile?.id && selectedShelfId && (
              <ProfileBookList userId={profile.id} shelfId={selectedShelfId} />
            )}
          </View>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}
