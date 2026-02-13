import { Moon, Sun } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

const ThemeSelector = () => {
    const { colorScheme, setColorScheme } = useColorScheme();

    const options = [
        { value: 'light', label: 'Light', icon: Sun },
        { value: 'dark', label: 'Dark', icon: Moon },
    ] as const;

    return (
        <View className="flex-row bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl mb-6">
            {options.map((option) => {
                const isActive = colorScheme === option.value;
                const Icon = option.icon;

                return (
                    <Pressable
                        key={option.value}
                        onPress={() => setColorScheme(option.value)}
                        className={`flex-1 flex-row items-center justify-center py-2.5 rounded-lg space-x-2 ${isActive ? 'bg-white dark:bg-zinc-950 shadow-sm' : 'bg-transparent'
                            }`}
                    >
                        <Icon
                            size={18}
                            color={isActive ? (colorScheme === 'dark' ? '#f4f4f5' : '#18181b') : (colorScheme === 'dark' ? '#a1a1aa' : '#71717a')}
                            strokeWidth={2.5}
                        />
                        <Text
                            className={`text-sm font-medium ${isActive ? 'text-zinc-900 dark:text-gray-100' : 'text-zinc-500 dark:text-zinc-400'
                                }`}
                        >
                            {option.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
};

export default ThemeSelector;
