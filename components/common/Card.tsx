import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
    children: React.ReactNode;
}

const Card = ({ children, className, ...props }: CardProps) => {
    return (
        <View
            {...props}
            className={`bg-card rounded-xl p-6 shadow-sm border border-zinc-200 ${className || ''}`}
        >
            {children}
        </View>
    );
};

export default React.memo(Card);
