import AppText from '@/components/common/AppText';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
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
                        <AppText>Onboarding!</AppText>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default OnboardingScreen;