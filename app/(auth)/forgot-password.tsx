import AppText from '@/components/common/AppText';
import Buttons from '@/components/common/Buttons';
import Card from '@/components/common/Card';
import Icons from '@/components/common/Icons';
import Input from '@/components/common/Input';
import { Link } from "expo-router";
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const insets = useSafeAreaInsets();

  async function handleResetPassword() {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    if (email.trim() === '') {
      setError("Please enter your email address.");
      setLoading(false);
      return;
    }

    const { data: emailExists, error: checkError } = await supabase
      .rpc('check_email_exists', { check_email: email });

    if (checkError) {
      setError("Error checking email. Please try again.");
      setLoading(false);
      return;
    }

    if (!emailExists) {
      setError("We couldn't find an account with that email address.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'shelfspaceapp://reset-password',
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccessMessage("Password reset instructions have been sent to your email.");
    }
    setLoading(false);
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
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
              <AppText variant="title" className="dark:text-gray-50 pb-2">
                Shelf
              </AppText>
              <Icons.logo width={100} height={100} color="#000" />
              <AppText variant="title" className="dark:text-gray-50 pb-2">
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
            <View className="mb-6">
              <AppText variant="label" className="mb-1 ml-1">
                Email
              </AppText>
              <Input
                placeholder="Email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <Buttons title="Send Reset Link" loading={loading} onPress={() => handleResetPassword()} />

            <View className="mt-4 flex-row justify-center">
              <Link href="/(auth)/login" asChild>
                <AppText variant="label" className="text-zinc-500">
                  Back to Sign In
                </AppText>
              </Link>
            </View>
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

export default ForgotPasswordScreen;
