import { supabase } from "@/app/lib/supabase";
import DropdownButton from "@/components/button/DropdownButton";
import ProfileCard from "@/components/card/ProfileCard";
import ProfileBookList from "@/components/profile/ProfileBookList";
import React, { useEffect, useState, useCallback } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function UserProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any | null>(null);
  const [shelves, setShelves] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [readCount, setReadCount] = useState<number>(0);
  const [readingCount, setReadingCount] = useState<number>(0);
  const [isOwner, setIsOwner] = useState(false);
  
  const [selectedShelfId, setSelectedShelfId] = useState<string | null>(null);

  const shelfOptions = shelves.map(shelf => ({
    label: shelf.name,
    onPress: () => setSelectedShelfId(shelf.id),
  }));

  useEffect(() => {
    if (shelves.length > 0) {
      setSelectedShelfId(shelves[0].id);
    }
  }, [shelves]);

  useFocusEffect(
    useCallback(() => {
    let mounted = true;

    async function fetchData() {
      if (!id) return;
      
      setLoading(true);
      setError(null);

      // Check if current logged in user is viewing their own profile via this route
      const { data: userData } = await supabase.auth.getUser();
      if (mounted && userData?.user?.id === id) {
        setIsOwner(true);
      }

      // fetch profile data for the requested user
      const { data: profileData, error: profileErr } = await supabase
        .from("profiles")
        .select(
          "id, first_name, last_name, username, bio, avatar_url, read_count, reading_count, shelved_count, post_count, friend_count, follow_count",
        )
        .eq("id", id)
        .single();

      if (profileErr) {
        if (mounted) setError(profileErr.message);
      } else {
        if (mounted) setProfile(profileData ?? null);
      }

      // fetch shelves data for the requested user
      const { data: shelvesData, error: shelvesErr } = await supabase
        .from("shelves")
        .select(
          "id, name, created_at",
        )
        .eq("user_id", id);

      if (shelvesErr) {
        if (mounted) setError(shelvesErr.message);
      } else {
        if (mounted) setShelves(shelvesData ?? []);
        
        let computedReadCount = 0;
        let computedReadingCount = 0;
        
        if (shelvesData) {
          const readShelf = shelvesData.find(s => s.name?.toLowerCase() === 'read');
          const readingShelf = shelvesData.find(s => s.name?.toLowerCase() === 'reading');
          
          if (readShelf) {
             const { count } = await supabase
               .from('shelf_books')
               .select('*', { count: 'exact', head: true })
               .eq('shelf_id', readShelf.id);
             computedReadCount = count || 0;
          }
          
          if (readingShelf) {
             const { count } = await supabase
               .from('shelf_books')
               .select('*', { count: 'exact', head: true })
               .eq('shelf_id', readingShelf.id);
             computedReadingCount = count || 0;
          }
        }
        
        if (mounted) {
          setReadCount(computedReadCount);
          setReadingCount(computedReadingCount);
        }
      }

      if (mounted) setLoading(false);
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [id])
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-background"
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
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
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
            isOwner={isOwner}
          />

          <View className="mt-4 px-4 items-start">
            <DropdownButton
              title={
                selectedShelfId
                  ? shelves.find((shelf) => shelf.id === selectedShelfId)?.name
                  : "Shelves"
              }
              dropdownItems={shelfOptions}
              variant="secondary"
              size="sm"
              dropdownPosition="right"
            />
          </View>

          <View className="flex-1 mt-4 bg-[#E5E3DB] pt-4 relative">
            <LinearGradient
              colors={['rgba(0,0,0,0.1)', 'transparent']}
              style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 18 }}
              pointerEvents="none"
            />
            {profile?.id && selectedShelfId && (
              <ProfileBookList userId={profile.id} shelfId={selectedShelfId} />
            )}
          </View>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}
