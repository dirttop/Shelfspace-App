import Buttons from '@/components/common/Buttons';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white dark:bg-zinc-950" style={{ paddingTop: insets.top }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center p-5"
          contentContainerStyle={{
            paddingBottom: 20 + insets.bottom //easier to read than inline
          }}
          className="flex-1"
        >
          <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-zinc-950 dark:text-gray-100">
              Welcome Back
            </Text>
          </View>

          <Card className="w-full max-w-md mx-auto">
            <View className="mb-4">
              <Text className="text-sm font-medium text-zinc-950 dark:text-gray-100 mb-1 ml-1">
                Email
              </Text>
              <Input
                placeholder="Email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-medium text-zinc-950 dark:text-gray-100 mb-1 ml-1">
                Password
              </Text>
              <Input
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <Buttons
              title="Sign in"
              onPress={() => { }}
            />

            <View className="mt-4 flex-row justify-center">
              <Text className="text-zinc-500 dark:text-zinc-400">
                Don't have an account?{' '}
              </Text>
              <Link href="/(main)/(tabs)/profile" asChild>
                <Text className="text-zinc-900 dark:text-gray-50 font-semibold">
                  Sign up
                </Text>
              </Link>
            </View>

          </Card>

          <View className="mt-8 items-center">
            <Text className="text-xs text-zinc-500 dark:text-zinc-400">
              © 2026 ShelfSpace
            </Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;