import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PressableScale } from 'pressto';
import React from "react";
import { View } from "react-native";


interface BookProps {
    uri?: string;
    onPress?: () => void;

}

const BookItem = ({uri}: BookProps) => {

    return(
        <View className = "flex-1 aspect-[2/3] m-0.5 bg-slate-100 rounded-lg items-center justify-center">
            <PressableScale>
                <MaterialCommunityIcons name="book-outline" size={28} color="#94a3b8" />
            </PressableScale>
        </View>
    );
};

export default BookItem;