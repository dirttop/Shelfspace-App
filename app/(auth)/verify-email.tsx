import AppText from '@/components/common/AppText';
import Buttons from '@/components/common/Buttons';
import Card from '@/components/common/Card';
import Icons from '@/components/common/Icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import * as Linking from 'expo-linking';

export default function VerifyEmailScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    if (!email) return;
    
    setResending(true);
    const redirectUrl = Linking.createURL('/');
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    setResending(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Verification email resent! Please check your inbox.');
    }
  };

  return (
    <View
      className="flex-1 bg-white px-5"
      style={{
        paddingTop: insets.top + 20,
        paddingBottom: insets.bottom + 20,
      }}
    >
      <View className="flex-1 justify-center">
        <View className="items-center mb-8">
          <View className="flex-row items-center justify-center">
            <AppText variant="title" className="text-black-50 pb-2">
              Shelf
            </AppText>
            <Icons.logo width={100} height={100} color="#000" />
            <AppText variant="title" className="text-black-50 pb-2">
              Space
            </AppText>
          </View>
        </View>

        <Card className="w-full max-w-md mx-auto items-center p-6 space-y-4">
          <AppText variant="subtitle" className="text-center font-bold mt-4 mb-2">
            Check your inbox!
          </AppText>
          
          <AppText variant="body" className="text-center text-zinc-600">
            We've sent a verification link to:
          </AppText>
          
          <AppText variant="body" className="text-center font-bold mb-4">
            {email || 'your email address'}
          </AppText>

          <AppText variant="caption" className="text-center text-zinc-500 mt-4 mb-6">
            Please click the link in the email to verify your account. Once verified, return here or click the button below to sign in.
          </AppText>

          <View className="w-full mt-4 space-y-3">
            <Buttons
              title="Resend Verification Email"
              onPress={handleResend}
              variant="secondary"
              loading={resending}
              disabled={resending || !email}
            />
            <Buttons
              title="Go to Sign In"
              onPress={() => router.replace('/(auth)/login')}
              variant="primary"
            />
          </View>
        </Card>
      </View>
    </View>
  );
}
