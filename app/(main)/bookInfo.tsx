import AppText from "@/components/common/AppText";
import Buttons from "@/components/common/Buttons";
import { Book } from "@/types/book";
import React from "react";
import { Image, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Temporary mock data for boilerplating
const mockBook: Book = {
    isbn: "9780765326355",
    title: "The Way of Kings",
    authors: ["Brandon Sanderson"],
    description: "An epic fantasy novel...",
    publisher: "Tor Books",
    pageCount: 1007,
    source: "Google Books",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780765326355-L.jpg", 
};

export default function BookInfo() {
    const book = mockBook;//replace with props

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-zinc-900">
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                <View className="items-center pt-6 pb-6 px-4">
                    {book.coverImage ? (
                        <Image 
                            source={{ uri: book.coverImage }} 
                            className="w-40 h-60 rounded-md mb-6"
                            resizeMode="cover"
                        />
                    ) : (
                        <View className="w-40 h-60 bg-slate-200 dark:bg-slate-800 rounded-md mb-6 items-center justify-center">
                            <AppText>No Cover</AppText>
                        </View>
                    )}
                    
                    <AppText variant="title" className="text-center mb-1">
                        {book.title}
                    </AppText>
                    
                    <AppText variant="subtitle" className="text-slate-500 mb-6 text-center">
                        {book.authors?.join(", ")}
                    </AppText>

                    <View className="flex-row items-center justify-center w-full mb-8">
                        <View className="items-center px-6 border-r border-slate-200 dark:border-slate-800">
                            <AppText variant="subtitle" className="font-bold">4.2</AppText>
                            <AppText variant="caption" className="text-slate-500 mt-1">Rating</AppText>
                        </View>
                        <View className="items-center px-6 border-r border-slate-200 dark:border-slate-800">
                            <AppText variant="subtitle" className="font-bold">{book.pageCount || "-"}</AppText>
                            <AppText variant="caption" className="text-slate-500 mt-1">Pages</AppText>
                        </View>
                        <View className="items-center px-6">
                            <AppText variant="subtitle" className="font-bold">2014</AppText>
                            <AppText variant="caption" className="text-slate-500 mt-1">Published</AppText>
                        </View>
                    </View>

                    <View className="w-full">
                        <Buttons title="Want to Read" variant="primary" className="mb-3 w-full" />
                        <Buttons title="Buy or Source" variant="secondary" className="w-full" />
                    </View>
                </View>

                <View className="h-px bg-slate-200 dark:bg-slate-800 my-2 mx-4" />

                <View className="px-4 py-6 mb-8">
                    <AppText variant="subtitle" className="mb-4 font-bold">
                        About this book
                    </AppText>
                    <AppText variant="body" className="text-slate-700 dark:text-slate-300 leading-6">
                        {book.description}
                    </AppText>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}