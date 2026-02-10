import React from 'react';
import {View, Image} from 'react-native';
import AppText from '@/components/common/AppText';

interface AvatarProps {
    src?: string; 
    name?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    onPress: () => void;
}

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-20 h-20',
  xl: 'w-32 h-32',
};

const textMap = {
  sm: 'text-xs',
  md: 'text-base',
  lg: 'text-2xl',
  xl: 'text-4xl',
};

const Avatar = ({src, name, size}: AvatarProps) => {

    const getInitials = (fullName?: string) => {
        
    }
    <View>
    </View>
  );
};

export default Avatar;