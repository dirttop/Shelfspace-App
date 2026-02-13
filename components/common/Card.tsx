import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
    children: React.ReactNode;
}

const Card = ({ children, className, ...props }: CardProps) => {
    return (
        <View
            {...props}
            className={`bg-white dark:bg-zinc-950 text-zinc-950 dark:text-gray-100 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 ${className || ''}`}
        >
            {children}
        </View>
    );
};

export default Card;
