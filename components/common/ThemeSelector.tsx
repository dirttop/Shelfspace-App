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
        <View className="flex-row bg-gray-100 dark:bg-gray-900 p-1 rounded-xl mb-6">
            {options.map((option) => {
                const isActive = colorScheme === option.value;
                const Icon = option.icon;

                return (
                    <Pressable
                        key={option.value}
                        onPress={() => setColorScheme(option.value)}
                        className={`flex-1 flex-row items-center justify-center py-2.5 rounded-lg space-x-2 ${isActive ? 'bg-background shadow-sm' : 'bg-transparent'
                            }`}
                    >
                        <Icon
                            size={18}
                            color={isActive ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'}
                            strokeWidth={2.5}
                        />
                        <Text
                            className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'
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
