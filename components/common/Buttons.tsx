import React from 'react';
import { Pressable, Text } from "react-native";

interface ButtonProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
}

const Buttons = ({title, onPress, disabled}: ButtonProps) => {
    return (
        <Pressable 
        onPress={onPress} 
        disabled={disabled}
        className={`p-2 rounded-lg ${disabled ? 'bg-gray-400' : 'bg-blue-600'}`}
        >
            <Text className="text-white text-center">{title}</Text>
        </Pressable>
    );
};
export default Buttons;