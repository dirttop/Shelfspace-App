import { supabase } from "@/app/lib/supabase";
import Avatar from "@/components/common/Avatar";
import Buttons from "@/components/common/Buttons";
import Input from "@/components/common/Input";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState, useRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { CustomizeShelvesModal } from "@/components/modals/CustomizeShelvesModal";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function EditProfile() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [newAvatarUri, setNewAvatarUri] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const customizeModalRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userData?.user) {
        if (mounted) Alert.alert(userErr?.message ?? "Not signed in");
        if (mounted) setLoading(false);
        return;
      }
      const uId = userData.user.id;
      setUserId(uId);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", uId)
        .single();
      if (!mounted) return;
      if (error) {
        // allow creating profile on save
      } else if (data) {
        setFirstName(data.first_name ?? "");
        setLastName(data.last_name ?? "");
        setUsername(data.username ?? "");
        setBio(data.bio ?? "");
        setAvatarUrl(data.avatar_url ?? null);
      }
      setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  function validate() {
    if (!firstName.trim()) {
      Alert.alert("First name is required");
      return false;
    }
    if (!lastName.trim()) {
      Alert.alert("Last name is required");
      return false;
    }
    if (!username.trim()) {
      Alert.alert("Username is required");
      return false;
    }
    return true;
  }

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "Permission needed to access photos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setNewAvatarUri(result.assets[0].uri);
      }
    } catch (err) {
      Alert.alert("Image picker error", "Could not pick image");
    }
  };

  const uploadAvatar = async (userId: string, uri: string) => {
    const extMatch = uri.match(/\.(\w+)(?:\?|$)/);
    const ext = extMatch ? extMatch[1] : "jpg";
    const filename = `${userId}_${Date.now()}.${ext}`;

    const formData = new FormData();
    formData.append("file", {
      uri,
      name: filename,
      type: `image/${ext}`,
    } as any);

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filename, formData, { upsert: false });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("avatars").getPublicUrl(filename);
    return data.publicUrl;
  };

  async function saveProfile() {
    if (!validate()) return;
    setSaving(true);
    try {
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userData?.user) {
        Alert.alert(userErr?.message ?? "Not signed in");
        setSaving(false);
        return;
      }
      const userId = userData.user.id;
      const desiredUsername = username.trim().toLowerCase();
      // check username availability (exclude current user's record)
      if (desiredUsername) {
        const { data: existing, error: existingErr } = await supabase
          .from("profiles")
          .select("id")
          .eq("username", desiredUsername)
          .neq("id", userId)
          .limit(1);

        if (existingErr) {
          console.warn(
            "Username availability check failed:",
            existingErr.message,
          );
          // fall through: allow server to enforce uniqueness if needed
        } else if (existing && Array.isArray(existing) && existing.length > 0) {
          setUsernameError("That username is already in use.");
          setSaving(false);
          return;
        }
      }

      let finalAvatarUrl = avatarUrl;
      if (newAvatarUri) {
        try {
          finalAvatarUrl = await uploadAvatar(userId, newAvatarUri);
        } catch (e: any) {
          console.warn("avatar upload failed", e);
          Alert.alert("Upload failed", "Could not upload avatar. Saving profile without it.");
        }
      }

      const { error } = await supabase.from("profiles").upsert({
        id: userId,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        username: desiredUsername,
        bio: bio.trim() || null,
        avatar_url: finalAvatarUrl,
      });
      if (error) {
        Alert.alert(
          "Failed to save profile",
          error.message ?? "Unexpected error",
        );
      } else {
        // navigate to profile and replace current route so profile reloads
        router.replace("/profile");
      }
    } catch (e: any) {
      Alert.alert("Unexpected error", e?.message ?? String(e));
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <View
        className="flex-1 justify-center items-center"
        style={{ paddingTop: insets.top }}
      >
        <ActivityIndicator />
      </View>
    );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1"
      keyboardVerticalOffset={100}
    >
      {/* Fixed header with back arrow (left) and centered title */}
      <View
        className="absolute left-0 right-0 z-50"
        style={{ top: insets.top, height: 56 }}
      >
        <View className="flex-row items-center justify-center h-full px-4">
          <Pressable
            onPress={() => router.replace("/profile")}
            className="absolute left-3 p-2"
            accessibilityLabel="Back"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text className="text-2xl">←</Text>
          </Pressable>

          <Text className="text-lg font-bold">Edit Profile</Text>
        </View>
      </View>

      <ScrollView
        contentContainerClassName="flex-grow p-5"
        contentContainerStyle={{
          // ensure content starts below the absolute-positioned back arrow
          paddingBottom: 20 + insets.bottom,
          paddingTop: insets.top + 56,
        }}
      >
        {/* Profile Picture */}
        <View className="items-center mb-6 mt-4">
          <Avatar
            uri={newAvatarUri || avatarUrl || undefined}
            name={`${firstName} ${lastName}`.trim() || undefined}
            size="xl"
          />
          <View className="mt-4">
            <Buttons
              title="Change Picture"
              onPress={pickImage}
              size="sm"
              variant="secondary"
            />
          </View>
        </View>

        {/* Back arrow is rendered absolute in top-left */}
        <View className="mb-4">
          <Text className="text-sm font-medium mb-1">First name</Text>
          <Input
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First name"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium mb-1">Last name</Text>
          <Input
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last name"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium mb-1">Username</Text>
          <Input
            value={username}
            onChangeText={(t) => {
              setUsername(t);
              if (usernameError) setUsernameError(null);
            }}
            placeholder="Username"
            autoCapitalize="none"
          />
          {usernameError ? (
            <Text className="text-xs text-red-500 mt-2">{usernameError}</Text>
          ) : null}
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium mb-1">Bio</Text>
          <Input
            value={bio}
            onChangeText={setBio}
            placeholder="Short bio"
            multiline
          />
        </View>

        <View className="mt-2">
          <Buttons 
            title="Customize Shelves" 
            variant="outline" 
            onPress={() => customizeModalRef.current?.present()} 
          />
        </View>

        <View className="mt-4">
          <Buttons title="Save" onPress={saveProfile} loading={saving} />
        </View>
      </ScrollView>

      <CustomizeShelvesModal
        ref={customizeModalRef}
        userId={userId || ""}
        onShelvesUpdated={() => {}} 
      />
    </KeyboardAvoidingView>
  );
}
