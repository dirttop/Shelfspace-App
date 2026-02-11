import AppText from '@/components/common/AppText';
import Buttons from '@/components/common/Buttons';
import React from 'react';
import { View, ViewProps } from 'react-native';
import Avatar from '../common/Avatar';

interface ProfileProps extends ViewProps {
    fullName: string;
    username: string;
    bio?: string;
    uriAvatar?: string;
    readCount?: number;
    readingCount?: number;
    shelvedCount?: number;
    postCount?: number;
    friendCount?: number;
    followCount?: number;
}

const ShelfStat = ({ label, value }: { label: string; value: number }) => (
  <View className="items-center">
    <AppText className="text-lg font-bold text-slate-900">{value}</AppText>
    <AppText className="text-xs text-slate-500">{label}</AppText>
  </View>
);



const ProfileCard = ({
    fullName, 
    username,
    bio,
    uriAvatar,
    readCount = 0,
    readingCount = 0,
    shelvedCount = 0,
    postCount = 0,
    friendCount = 0,
    followCount = 0,
    className,
    ...props
}: ProfileProps) => {
    return (
        <View className={`p-6 bg-white rounded-2xl shadow-sm border border-slate-100 ${className}`} 
        {...props}
        >
            <View className={'flex-row items-center mb-6'}>
                <View className='pr-6'>
                    <Avatar uri={uriAvatar} name={fullName} size='xl' />
                </View>
               
               <View className="flex-1 gap-y-1 mt-6">
                    <AppText variant='subtitle'>{fullName}</AppText>
                    <AppText variant='caption'>@{username}</AppText>
                    <View className='flex-1 flex-row justify-around'>
                            <ShelfStat label="Reading" value={readingCount}/>
                            <ShelfStat label="Read" value={readCount} />
                            <ShelfStat label='Shelved' value={shelvedCount}/>
                    </View>
                </View>
            </View>

            <View className='mb-4 p-2'>
                    {bio && (
                    <AppText className="text-sm text-slate-700 leading-5">
                        {bio}
                    </AppText>
                    )}
            </View>
            <View className="flex-row gap-x-3">
                <View className="w-1/2">
                    <Buttons
                        title="Edit Profile"
                        size='sm'
                        onPress={() => {}}
                    />
                </View>
            </View>
        </View>
    );
};

export default ProfileCard;
