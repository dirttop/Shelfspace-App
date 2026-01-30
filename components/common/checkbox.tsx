import { Pressable, Text, View } from "react-native";
import { Check } from 'lucide-react-native';


const Checkbox = (props: {value: boolean, label: string, onValueChange: (value: boolean) => void}) => {
    return (
        <Pressable 
            onPress={() => props.onValueChange(!props.value)}
            className="flex-row items-center p-2"
        >
            <View className={`w-6 h-6 rounded border-2 items-center justify-center ${props.value ? 'bg-blue-600 border-blue-600' : 'border-gray-400'}`}>
                {props.value && <Check size={16} color="white" strokeWidth={3} />}
            </View>
            <Text className="ml-3 text-base text-black">
                {props.label}
            </Text>
        </Pressable>
    );
};
export default Checkbox;