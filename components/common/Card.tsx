import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
    children: React.ReactNode;
}

const Card = ({ children, className, ...props }: CardProps) => {
    return (
        <View
            {...props}
            className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 ${className || ''}`}
        >
            {children}
        </View>
    );
};

export default Card;
