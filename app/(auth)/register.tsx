import Buttons from '@/components/common/Buttons';
import Card from '@/components/common/Card';
import Checkbox from '@/components/common/Checkbox';
import Input from '@/components/common/Input';
import ThemeSelector from '@/components/common/ThemeSelector';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [terms, setTerms] = useState(false);

  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
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
            <Text className="text-3xl font-bold text-foreground">
              Create Account
            </Text>
          </View>

          <Card className="w-full max-w-md mx-auto">
            <View className="mb-4">
              <ThemeSelector />
              <Text className="text-sm font-medium text-foreground mb-1 ml-1">
                Full Name
              </Text>
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
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-foreground mb-1 ml-1">
                Username
              </Text>
              <Input
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-foreground mb-1 ml-1">
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

            <View className="mb-4">
              <Text className="text-sm font-medium text-foreground mb-1 ml-1">
                Password
              </Text>
              <Input
                placeholder="Password (at least 6 characters)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <Text className="text-xs text-muted-foreground ml-1 mt-1">
                Passwords must be at least 6 characters.
              </Text>
            </View>

            <View className="mb-6">
              <Text className="text-sm font-medium text-foreground mb-1 ml-1">
                Confirm Password
              </Text>
              <Input
                placeholder="Re-enter password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            <View className="mb-6">
              <Checkbox
                label="I agree to the Terms of Service and Privacy Policy"
                value={terms}
                onValueChange={setTerms}
              />
            </View>

            <Buttons
              title="Create account"
              onPress={() => { }}
              disabled={!terms}
            />

            <View className="mt-4 flex-row justify-center">
              <Text className="text-muted-foreground">
                Already have an account?{' '}
              </Text>
              <Link href="/(auth)/login" asChild>
                <Text className="text-primary font-semibold">
                  Sign in
                </Text>
              </Link>
            </View>

          </Card>

          <View className="mt-8 items-center">
            <Text className="text-xs text-muted-foreground">
              © 2026 Shelfspace
            </Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegisterScreen;