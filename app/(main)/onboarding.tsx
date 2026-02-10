import Buttons from '@/components/common/Buttons';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
//Following account signup is onboarding

const OnboardingScreen = () => {
    const insets = useSafeAreaInsets();
    
    return(
        <View>
            <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    className="flex-1"
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >   
                <ScrollView
                          contentContainerStyle={{
                            flexGrow: 1,
                            justifyContent: 'center',
                            padding: 20,
                            paddingBottom: 20 + insets.bottom
                          }}
                          className="flex-1"
                >
                    <View>
                        <Text>Onboarding!</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default OnboardingScreen;