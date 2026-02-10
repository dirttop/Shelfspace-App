import AppText from '@/components/common/Input';
import React from 'react';
import { View, ViewProps } from 'react-native';

interface ProfileProps extends ViewProps {
    name: String;
    username: String;
    children: React.ReactNode;
}

const ProfileCard = () => {
    return (
        <View>
            <AppText>Profile Card Placeholder</AppText>
        </View>
    );
};

export default ProfileCard;
