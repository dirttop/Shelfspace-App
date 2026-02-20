import AppText from '@/components/common/AppText';
import Buttons from '@/components/common/Buttons';
import Card from '@/components/common/Card';
import Checkbox from '@/components/common/Checkbox';
import Icons from '@/components/common/Icons';
import Input from '@/components/common/Input';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const insets = useSafeAreaInsets();
  const isFormValid =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    username.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length >= 6 &&
    password === confirmPassword &&
    terms;

  async function signUpWithEmail() {
    setLoading(true);
    setSubmitAttempted(true);

    // use component-level validation
    if (!isFormValid) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
      setLoading(false);
      return;
    }

    const user = data?.user ?? null;

    // If we have a user id (some flows provide a session immediately), try to create/update the profile row.
    if (user?.id) {
      try {
        const { error: upsertError } = await supabase.from("profiles").upsert({
          id: user.id,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          username: username.trim().toLowerCase(),
        });

        if (upsertError) {
          // Non-fatal: show message so the developer/user can see why profile fields were not saved.
          console.warn("Profile upsert error:", upsertError.message);
          Alert.alert(
            "Warning",
            "Account created but we couldn't save your profile details yet.",
          );
        }
      } catch (e: any) {
        console.warn("Unexpected error upserting profile:", e?.message ?? e);
      }
    }

    // If signUp did not return a session (email confirmation required), inform the user.
    if (!data?.session) {
      Alert.alert("Please check your inbox for email verification!");
      setLoading(false);
      return;
    }

    // If we have a session, redirect to home
    if (data.session) {
      router.push("/home");
    }
    setLoading(false);
  }

  return (
    <View
      className="flex-1 bg-white dark:bg-zinc-950"
      style={{ paddingTop: insets.top }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center p-5"
          contentContainerStyle={{
            paddingBottom: 20 + insets.bottom, //easier to read than inline
          }}
          className="flex-1"
        >
          <View className="items-center mb-8">
            <View className="flex-row items-end justify-center gap-2">
              <Icons.logo width={100} height={100} color="#000" />
              <AppText className="text-3xl font-bold text-zinc-900 dark:text-gray-50 pb-2">
                ShelfSpace
              </AppText>
            </View>
          </View>

          <Card className="w-full max-w-md mx-auto">
            <View className="mb-4">

              <AppText variant="label" className="mb-1 ml-1">
                Full Name
              </AppText>
              <View className="flex-row space-x-2">
                <View className="flex-1">
                  <Input
                    placeholder="First name"
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                </View>
                <View className="flex-1">
                  <Input
                    placeholder="Last name"
                    value={lastName}
                    onChangeText={setLastName}
                  />
                </View>
              </View>
              {submitAttempted &&
                (firstName.trim() === "" || lastName.trim() === "") && (
                  <Text className="text-xs text-red-500 mt-2 ml-1">
                    First and last name are required.
                  </Text>
                )}
            </View>

            <View className="mb-4">
              <AppText variant="label" className="mb-1 ml-1">
                Username
              </AppText>
              <Input
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
              {submitAttempted && username.trim() === "" && (
                <Text className="text-xs text-red-500 mt-2 ml-1">
                  Username is required.
                </Text>
              )}
            </View>

            <View className="mb-4">
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
              {submitAttempted && email.trim() === "" && (
                <Text className="text-xs text-red-500 mt-2 ml-1">
                  Email is required.
                </Text>
              )}
            </View>

            <View className="mb-4">
              <AppText variant="label" className="mb-1 ml-1">
                Password
              </AppText>
              <Input
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <AppText className="text-xs text-zinc-500 dark:text-zinc-400">
                Passwords must be at least 6 characters.
              </AppText>
              {submitAttempted &&
                password.length > 0 &&
                password.length < 6 && (
                  <Text className="text-xs text-red-500 mt-2 ml-1">
                    Password must be at least 6 characters.
                  </Text>
                )}
            </View>

            <View className="mb-6">
              <AppText variant="label" className="mb-1 ml-1">
                Confirm Password
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
                  <Text className="text-xs text-red-500 mt-2 ml-1">
                    Passwords do not match.
                  </Text>
                )}
            </View>

            <View className="mb-6">
              <Checkbox
                label="I agree to the ShelfSpace Terms of Service and Privacy Policy"
                value={terms}
                onValueChange={setTerms}
              />
              {submitAttempted && !terms && (
                <Text className="text-xs text-red-500 mt-2 ml-1">
                  You must accept the terms to continue.
                </Text>
              )}
            </View>

            <Buttons
              title="Create account"
              onPress={() => signUpWithEmail()}
              disabled={!isFormValid || loading}
            />

            <View className="mt-4 flex-row justify-center">
              <Text className="text-zinc-500 dark:text-zinc-400">
                Already have an account?{" "}
              </Text>
              <Link href="/(auth)/login" asChild>
                <AppText className="font-semibold">
                  Sign in
                </AppText>
              </Link>
            </View>
          </Card>

          <View className="mt-8 items-center">
            <AppText variant="caption" className="text-zinc-500">
              © 2026 Shelfspace
            </AppText>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegisterScreen;
