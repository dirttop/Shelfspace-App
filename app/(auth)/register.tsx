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
  const [error, setError] = useState("");

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

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (signUpError) {
      setError(signUpError.message);
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
          <View className="items-center mb-1">
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
                  <AppText variant="caption" className="text-red-500 mt-2 ml-1">
                    First and last name are required.
                  </AppText>
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
                <AppText variant="caption" className="text-red-500 mt-2 ml-1">
                  Username is required.
                </AppText>
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
                <AppText variant="caption" className="text-red-500 mt-2 ml-1">
                  Email is required.
                </AppText>
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
              <AppText variant="caption" className="text-zinc-500 dark:text-zinc-400">
                Passwords must be at least 6 characters.
              </AppText>
              {submitAttempted &&
                password.length > 0 &&
                password.length < 6 && (
                  <AppText variant="caption" className="text-red-500 mt-2 ml-1">
                    Password must be at least 6 characters.
                  </AppText>
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
                  <AppText variant="caption" className="text-red-500 mt-2 ml-1">
                    Passwords do not match.
                  </AppText>
                )}
            </View>

            <View className="mb-6">
              <Checkbox
                label="I agree to the ShelfSpace Terms of Service and Privacy Policy"
                value={terms}
                onValueChange={setTerms}
              />
              {submitAttempted && !terms && (
                <AppText variant="caption" className="text-red-500 mt-2 ml-1">
                  You must accept the terms to continue.
                </AppText>
              )}
            </View>

            <Buttons
              title="Create account"
              onPress={() => signUpWithEmail()}
              disabled={!isFormValid || loading}
              loading={loading}
              variant="primary"
              size="lg"
            />

            <View className="mt-4 flex-row justify-center">
              <AppText className="text-zinc-500 dark:text-zinc-400">
                Already have an account?{" "}
              </AppText>
              <Link href="/(auth)/login" asChild>
                <AppText variant="label">
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
