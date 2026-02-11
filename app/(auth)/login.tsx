import AppText from '@/components/common/AppText';
import Buttons from '@/components/common/Buttons';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
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
            <AppText variant="title">
              Welcome Back
            </AppText>
          </View>

          <Card className="w-full max-w-md mx-auto">
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
            </View>

            <View className="mb-6">
              <AppText variant="label" className="mb-1 ml-1">
                Password
              </AppText>
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
              <AppText className="text-zinc-500">
                Don&apos;t have an account?{' '}
              </AppText>
              <Link href="/(main)/(tabs)/profile" asChild>
                <AppText className="font-semibold">
                  Sign up
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

export default LoginScreen;