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

    // First, check if the email actually exists in our profiles table
    // Depending on your RLS policies, you may need a secure RPC function.
    // Assuming profiles has an "email" column or we query it. 
    // Since we don't have an email column in profiles based on register file, 
    // we would usually need a secure Edge Function to check auth.users.
    // For now, if you are letting users sign in with email, we can attempt a dummy sign in
    // or call an RPC to verify. 

    // The most secure and standard way without exposing auth.users is to call an RPC function.
    // If you haven't set up an RPC, another way is to try sending the reset and relying on Supabase.
    // But since Supabase's resetPasswordForEmail returns success even if the email doesn't exist (to prevent email enumeration),
    // we MUST use a custom RPC or Edge function to securely check if it exists. 

    // Since I don't know your exact DB schema for `profiles` beyond first_name, last_name, username, 
    // Let's assume we can query `profiles` by joining or we added an email column.
    // If you don't have an email column in profiles, we will need to create an RPC function on your database.

    // Let's implement a clean call to an RPC function that you will need to add to your DB:
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
      redirectTo: 'shelfspaceapp://reset-password', // Matches scheme in app.json 
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccessMessage("Password reset instructions have been sent to your email.");
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
