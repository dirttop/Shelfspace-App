import AppText from '@/components/common/AppText';
import React, { useState } from 'react';
import { Image, View } from 'react-native';

interface AvatarProps {
    uri?: string; 
    name?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    onPress?: () => void;
}

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-20 h-20',
  xl: 'w-32 h-32',
};

const textMap = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-3xl',
  xl: 'text-5xl',
};

const Avatar = ({uri, name, size = 'md'}: AvatarProps) => {

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

    return (
    <View
        className={`
        ${sizeMap[size]} 
        rounded-full 
        bg-slate-200 
        items-center 
        justify-center 
        overflow-hidden
        `}
    >
        <AppText className={`${textMap[size]}`}>
            {getInitials(name)}
        </AppText>

        {uri && !hasError && (
        <Image
          source={{ uri }}
          className="absolute inset-0 w-full h-full"
          onError={() => setHasError(true)}
        />
        )}
    </View>
    );
};
export default Avatar;