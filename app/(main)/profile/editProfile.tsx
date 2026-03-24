// NOT IN USE
import { supabase } from "@/app/lib/supabase";
import AppText from "@/components/common/AppText";
import Avatar from "@/components/common/Avatar";
import Buttons from "@/components/common/Buttons";
import Input from "@/components/common/Input";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, View } from "react-native";

export default function EditProfile() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // load current profile from `profiles` table if present
    (async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, bio, avatar_url")
          .eq("id", user.id)
          .single();

        if (!error && data) {
          setName(data.full_name ?? "");
          setBio(data.bio ?? "");
          setAvatar(data.avatar_url ?? undefined);
        }
      } catch (e) {
        // ignore - profile table may not exist yet
      }
    })();
  }, []);

  const pickImageWithExpo = async () => {
    try {
      const ImagePicker = await import("expo-image-picker");
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Permission needed to access photos.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setAvatar(result.assets[0].uri);
      }
    } catch (err) {
      Alert.alert(
        "Image picker not available",
        "Install `expo-image-picker` to pick images.",
      );
    }
  };

  const uploadAvatar = async (userId: string, uri: string) => {
    // Attempt to fetch the file and upload to Supabase storage bucket `avatars`.
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const extMatch = uri.match(/\.(\w+)(?:\?|$)/);
      const ext = extMatch ? extMatch[1] : "jpg";
      const filename = `${userId}_${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filename, blob, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filename);
      return data.publicUrl;
    } catch (e) {
      throw e;
    }
  };

  const onSave = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");

      let avatarUrl = avatar;
      // If avatar is a local uri (file:// or blob from picker) attempt upload
      if (avatar && (avatar.startsWith("file:") || avatar.startsWith("/"))) {
        try {
          avatarUrl = await uploadAvatar(user.id, avatar);
        } catch (e) {
          console.warn("avatar upload failed", e);
          Alert.alert(
            "Upload failed",
            "Could not upload avatar. Check console.",
          );
        }
      }

      // Upsert profile row
      const updates: any = {
        id: user.id,
        full_name: name,
        bio,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);
      if (error) throw error;

      // Success - go back to profile
      router.back();
    } catch (e: any) {
      console.error(e);
      Alert.alert("Save failed", e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  const onUseUrl = () => {
    if (!imageUrlInput)
      return Alert.alert("No URL", "Paste an image URL first.");
    setAvatar(imageUrlInput.trim());
    setImageUrlInput("");
  };

  return (
    <View className="p-6">
      <View className="items-center mb-6">
        <Avatar uri={avatar} name={name || undefined} size="xl" />
        <View className="w-full mt-4">
          <Buttons
            title="Pick Image (expo-image-picker)"
            onPress={pickImageWithExpo}
            size="sm"
            variant="secondary"
          />
          <AppText className="text-sm text-slate-500 text-center mb-2">
            Or paste a public image URL
          </AppText>
          <Input
            value={imageUrlInput}
            onChangeText={setImageUrlInput}
            placeholder="https://..."
          />
          <Buttons title="Use URL" onPress={onUseUrl} size="sm" />
        </View>
      </View>

      <View>
        <AppText className="text-sm font-semibold mb-2">Full name</AppText>
        <Input value={name} onChangeText={setName} placeholder="Full name" />

        <AppText className="text-sm font-semibold mb-2">Bio</AppText>
        <Input value={bio} onChangeText={setBio} placeholder="A short bio" />
      </View>

      <View className="mt-6">
        <Buttons
          title={loading ? "Saving..." : "Save Changes"}
          onPress={onSave}
          disabled={loading}
        />
        <Buttons
          title="Cancel"
          onPress={() => router.back()}
          variant="outline"
        />
      </View>
    </View>
  );
}
