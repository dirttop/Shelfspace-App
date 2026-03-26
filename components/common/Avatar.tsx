import AppText from '@/components/common/AppText';
import React, { useState } from 'react';
import { Image, View, TouchableOpacity } from 'react-native';

interface AvatarProps {
    uri?: string;
    name?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    onPress?: () => void;
}

import { avatarSizeMap, avatarTextMap } from "@/components/common/styles/avatarStyles";

const Avatar = ({ uri, name, size = 'md', onPress }: AvatarProps) => {

    const [hasError, setHasError] = useState(false);

    const getInitials = (fullName?: string) => {
        if (!fullName) return '?';
        return fullName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }

    const content = (
        <View
            className={`
            ${avatarSizeMap[size]} 
            rounded-full 
            bg-slate-200 
            items-center 
            justify-center 
            overflow-hidden
            `}
        >
            <AppText className={`${avatarTextMap[size]}`}>
                {getInitials(name)}
            </AppText>

            {uri && !hasError && (
                <Image
                    source={{ uri }}
                    className="absolute inset-0 w-full h-full"
                    onError={(e) => {
                        console.log("Avatar failed to load URL:", uri, e.nativeEvent.error);
                        setHasError(true);
                    }}
                />
            )}
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress}>
                {content}
            </TouchableOpacity>
        );
    }

    return content;
};
export default React.memo(Avatar);