import AppText from '@/components/common/AppText';
import Buttons from '@/components/common/Buttons'
import { Button } from '@react-navigation/elements';
import React from 'react';
import { View, ViewProps, Image } from 'react-native';

interface ProfileProps extends ViewProps {
    fullName: string;
    username: string;
    bio?: string;
    children: React.ReactNode;
}

const ProfileCard = ({fullName, username, bio}: ProfileProps) => {
    return (
        <View>
            <View>
                <Image/>
            </View>
            <View>
                <AppText>{fullName}</AppText>
                <AppText>{username}</AppText>
                <AppText>{bio}</AppText>
                <View>
                    <AppText>{readCount}</AppText>
                    <AppText>{readingCount}</AppText>
                    <AppText>{shelvedCount}</AppText>
                </View>
                <View>
                    <AppText>{postCount}</AppText>
                    <AppText>{friendCount}</AppText>
                    <AppText>{followCount}</AppText> 
                </View>
            </View>
            <View>
                <Buttons
                    title="Edit"
                    onPress={() => { }}
                />
            </View>
        </View>
    );
};

export default ProfileCard;
