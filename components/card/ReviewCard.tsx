import AppText from "@/components/common/AppText";
import Card from "@/components/common/Card";
import React from "react";
import { ViewProps } from "react-native";

interface ReviewProps extends ViewProps {
    
}

const ReviewCard = ({
    ...props
}: ReviewProps) => {
    return (
        <Card>
            <AppText>Review Card</AppText>
        </Card>
    )
}