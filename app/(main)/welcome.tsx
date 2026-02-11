import Buttons from '@/components/common/Buttons';
import Card from '@/components/common/Card';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
//First screen users see when not previously logged in

const WelcomeScreen = () => {
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
                        <Card className = "">
                            <View>
                                <Buttons
                                    title="Sign In"
                                    onPress={() => { }}
                                >
                                </Buttons>
                                <Buttons
                                    title="Sign Up"
                                    onPress={() => { }}
                                >
                                </Buttons>
                            </View>
                        </Card>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default WelcomeScreen;