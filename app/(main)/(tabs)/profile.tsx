import { supabase } from "@/app/lib/supabase";
import DropdownButton from "@/components/button/DropdownButton";
import ProfileCard from "@/components/card/ProfileCard";
import ProfileBookList from "@/components/profile/ProfileBookList";
import React, { useEffect, useState, useCallback } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  RefreshControl
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Profile() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any | null>(null);
  const [shelves, setShelves] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [readCount, setReadCount] = useState<number>(0);
  const [readingCount, setReadingCount] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);
  
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

  const fetchData = async () => {
    setError(null);

    // get current user
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user) {
      setError(userErr?.message ?? "Not signed in");
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
      setError(profileErr.message);
    } else {
      setProfile(profileData ?? null);
    }

    // fetch shelves data
    const { data: shelvesData, error: shelvesErr } = await supabase
      .from("shelves")
      .select(
        "id, name, created_at",
      )
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
           const { count } = await supabase
             .from('shelfBooks')
             .select('*', { count: 'exact', head: true })
             .eq('shelf_id', readShelf.id);
           computedReadCount = count || 0;
        }
        
        if (readingShelf) {
           const { count } = await supabase
             .from('shelfBooks')
             .select('*', { count: 'exact', head: true })
             .eq('shelf_id', readingShelf.id);
           computedReadingCount = count || 0;
        }
      }
      
      setReadCount(computedReadCount);
      setReadingCount(computedReadingCount);

      if (profileData && (profileData.read_count !== computedReadCount || profileData.reading_count !== computedReadingCount)) {
          try {
              await supabase.from("profiles").update({
                  read_count: computedReadCount,
                  reading_count: computedReadingCount
              }).eq("id", userId);
          } catch (syncErr) {
              console.error("Failed to sync profile read counts:", syncErr);
          }
      }
    }
  };

  useEffect(() => {
    let mounted = true;
    const loadInitialData = async () => {
      setLoading(true);
      await fetchData();
      if (mounted) {
        setLoading(false);
      }
    };
    
    loadInitialData();

    return () => {
      mounted = false;
    };
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

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
        <View className="flex-1" style={{ paddingTop: insets.top }}>
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
          
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >

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
              dropdownMaxWidth="50%"
              buttonMaxWidth="50%"
            />
          </View>

          <View className="flex-1 mt-4 bg-[#F2F0E9] pt-4 relative">
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
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
