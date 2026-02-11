import AppText from '@/components/common/AppText';
import Buttons from '@/components/common/Buttons';
import Card from '@/components/common/Card';
import Checkbox from '@/components/common/Checkbox';
import Icons from '@/components/common/Icons';
import Input from '@/components/common/Input';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { 
    KeyboardAvoidingView,
    Platform, 
    ScrollView, 
    Text, 
    View, 
    Alert } 
from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase'

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
  });

  const insets = useSafeAreaInsets();

  async function signUpWithEmail() {
      setLoading(true)
      const {
        data: { session },
        error,
      } = await supabase.auth.signUp({
        email: email,
        password: password,
      })
      if (session) {
        router.push("/home")
      }

      if (error) Alert.alert(error.message)
      if (!session) Alert.alert('Please check your inbox for email verification!')
      setLoading(false)
    }



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
            <View className="flex-row items-end justify-center gap-2">
              <Icons.logo width={100} height={100} color="#000" />
              <AppText variant="title">
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
              <AppText variant="caption" className="text-zinc-500">
                Passwords must be at least 6 characters.
              </AppText>
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
            </View>

            <View className="mb-6">
              <Checkbox
                label="I agree to the ShelfSpace Terms of Service and Privacy Policy"
                value={terms}
                onValueChange={setTerms}
              />
            </View>

            <Buttons
              title="Create account"
              onPress={() => signUpWithEmail()}
              disabled={!terms}
            />

            <View className="mt-4 flex-row justify-center">
              <AppText className="text-zinc-500">
                Already have an account?{' '}
              </AppText>
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