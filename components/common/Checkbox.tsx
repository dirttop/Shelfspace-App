import { Check } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Pressable, Text, View } from "react-native";


const Checkbox = (props: { value: boolean, label: string, onValueChange: (value: boolean) => void }) => {
    const { colorScheme } = useColorScheme();
    return (
        <Pressable
            onPress={() => props.onValueChange(!props.value)}
            className="flex-row items-center p-2"
        >
            <View className={`w-6 h-6 rounded border-2 items-center justify-center ${props.value
                ? 'bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100'
                : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950'
                }`}>
                {props.value && <Check size={16} color={colorScheme === 'dark' ? '#09090b' : '#fafafa'} strokeWidth={3} />}
            </View>
            <Text className="ml-3 text-base text-zinc-950 dark:text-gray-100">
                {props.label}
            </Text>
        </Pressable>
    );
};
export default Checkbox;