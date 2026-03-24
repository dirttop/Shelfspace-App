import AppText from '@/components/common/AppText';
import Buttons from '@/components/common/Buttons';
import Card from '@/components/common/Card';
import Icons from '@/components/common/Icons';
import Input from '@/components/common/Input';
import { router } from "expo-router";
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";

const ResetPasswordScreen = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const insets = useSafeAreaInsets();

  const isFormValid = password.length >= 6 && password === confirmPassword;

  async function handleUpdatePassword() {
    setLoading(true);
    setError("");
    setSubmitAttempted(true);

    if (!isFormValid) {
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccessMessage("Your password has been successfully updated!");
      // We can redirect the user to log in after a couple seconds
      setTimeout(() => {
        router.replace("/(auth)/login");
      }, 2000);
    }
    setLoading(false);
  }

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center p-5"
          contentContainerStyle={{
            paddingBottom: 20 + insets.bottom,
          }}
          className="flex-1"
        >
          <View className="items-center mb-4">
            <View className="flex-row items-center justify-center">
              <AppText variant="title" className="text-black-50 pb-2">
                Shelf
              </AppText>
              <Icons.logo width={100} height={100} color="#000" />
              <AppText variant="title" className="text-black 50 pb-2">
                Space
              </AppText>
            </View>
          </View>

          {error ? (
            <View className="items-center mb-4">
              <AppText variant="body" className="text-red-500 text-center">
                {error}
              </AppText>
            </View>
          ) : null}

          {successMessage ? (
            <View className="items-center mb-4">
              <AppText variant="body" className="text-green-600 text-center">
                {successMessage}
              </AppText>
            </View>
          ) : null}

          <Card className="w-full max-w-md mx-auto">
            <View className="mb-4">
              <AppText variant="body" className="mb-4 text-center font-semibold text-zinc-700">
                Create a new password
              </AppText>

              <AppText variant="label" className="mb-1 ml-1">
                New Password
              </AppText>
              <Input
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <AppText className="text-xs text-zinc-500 mb-2">
                Passwords must be at least 6 characters.
              </AppText>
              {submitAttempted &&
                password.length > 0 &&
                password.length < 6 && (
                  <AppText className="text-xs text-red-500 mt-1 ml-1 mb-2">
                    Password must be at least 6 characters.
                  </AppText>
                )}
            </View>

            <View className="mb-6">
              <AppText variant="label" className="mb-1 ml-1">
                Confirm New Password
              </AppText>
              <Input
                placeholder="Re-enter password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
              {submitAttempted &&
                confirmPassword.length > 0 &&
                password !== confirmPassword && (
                  <AppText className="text-xs text-red-500 mt-2 ml-1">
                    Passwords do not match.
                  </AppText>
                )}
            </View>

            <Buttons
              title="Update Password"
              loading={loading}
              disabled={!isFormValid || loading || successMessage !== ""}
              onPress={() => handleUpdatePassword()}
            />
          </Card>

          <View className="mt-8 items-center">
            <AppText variant="caption" className="text-zinc-500">
              © 2026 ShelfSpace
            </AppText>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ResetPasswordScreen;
