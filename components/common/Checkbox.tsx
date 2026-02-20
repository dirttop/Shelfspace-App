import { Check } from 'lucide-react-native';
import { memo } from 'react';
import { Pressable, View } from "react-native";


import AppText from './AppText';

const Checkbox = (props: { value: boolean, label: string, onValueChange: (value: boolean) => void }) => {
    return (
        <Pressable
            onPress={() => props.onValueChange(!props.value)}
            className="flex-row items-center p-2"
        >
            <View className={`w-6 h-6 rounded border-2 items-center justify-center ${props.value
                ? 'bg-zinc-900 border-zinc-900'
                : 'border-zinc-200 bg-white'
                }`}>
                {props.value && <Check size={16} color={'#fafafa'} strokeWidth={3} />}
            </View>
            <AppText className="ml-3">
                {props.label}
            </AppText>
        </Pressable>
    );
};
export default memo(Checkbox);