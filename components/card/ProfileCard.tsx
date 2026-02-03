import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
    children: React.ReactNode;
}

const Card = ({ children, className, ...props }: CardProps) => {
    return (
        <View
            {...props}
            className={`bg-card text-card-foreground rounded-xl p-6 shadow-sm border border-border ${className || ''}`}
        >
            
            {children}
        </View>
    );
};

export default Card;
