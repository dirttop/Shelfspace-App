import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, X } from 'lucide-react-native';
import AppText from '@/components/common/AppText';
import Avatar from '@/components/common/Avatar';
import { supabase } from '@/app/lib/supabase';

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data, error } = await supabase
        .from('notifications')
        .select(`
          id,
          title,
          data,
          created_at,
          sender:profiles!senderId(
            id,
            first_name,
            last_name,
            avatar_url,
            username
          )
        `)
        .eq('receiverId', userData.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const removeNotification = async (id: string | number) => {
    // Optimistically remove from state
    setNotifications(prev => prev.filter(n => n.id !== id));
    try {
      await supabase.from('notifications').delete().eq('id', id);
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const clearAllNotifications = async () => {
    if (notifications.length === 0) return;
    // Optimistically clear all
    setNotifications([]);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;
      await supabase.from('notifications').delete().eq('receiverId', userData.user.id);
    } catch (err) {
      console.error('Error clearing all notifications:', err);
    }
  };

  const handleNotificationPress = (senderId: string) => {
    router.push(`/user/${senderId}`);
  };

  const renderNotification = ({ item }: { item: any }) => {
    const sender = Array.isArray(item.sender) ? item.sender[0] : item.sender;
    const json = item.data ? JSON.parse(item.data) : {};
    const name = sender ? `${sender.first_name} ${sender.last_name || ''}`.trim() : 'Someone';

    let description = item.title;
    if (json.type === 'friend_request') {
      description = 'sent you a friend request!';
    } else if (json.type === 'friend_accept') {
      description = 'accepted your friend request!';
    } else if (json.type === 'new_review') {
      description = `posted a review on ${json.bookTitle}!`;
    }

    return (
      <View className="flex-row items-center px-4 py-5 border-b border-gray-100">
        <TouchableOpacity 
          className="flex-1 flex-row items-center pr-4"
          onPress={() => sender?.id ? handleNotificationPress(sender.id) : null}
        >
          <Avatar 
             uri={sender?.avatar_url} 
             name={name} 
             size="md" 
          />
          <View className="flex-1 ml-4 justify-center">
             <AppText variant="body" className="leading-6 text-gray-800">
                <AppText variant="body" className="font-sans-bold text-black">{name}</AppText>
                {' '}{description}
             </AppText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          className="w-8 h-8 items-center justify-center rounded-full bg-slate-100"
          onPress={() => removeNotification(item.id)}
        >
          <X size={16} color="#64748B" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <View 
        className="px-4 flex-row items-center justify-between mt-4 pb-4 border-b border-gray-200" 
        style={{ paddingTop: Math.max(insets.top, 20) }}
      >
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.push("/(tabs)/home" as any);
              }
            }} 
            className="w-10 h-10 items-center justify-center rounded-full bg-slate-200"
          >
            <ChevronLeft size={24} color="#333333" />
          </TouchableOpacity>
          <AppText variant="title" className="ml-4 pt-2">Notifications</AppText>
        </View>

        {notifications.length > 0 && (
          <TouchableOpacity onPress={clearAllNotifications} className="pt-2">
            <AppText variant="body" className="text-slate-500 font-sans-bold">Clear All</AppText>
          </TouchableOpacity>
        )}
      </View>

      {loading && notifications.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : notifications.length === 0 ? (
        <View className="flex-1 items-center justify-center p-6">
          <AppText variant="body" className="text-gray-500 text-center">
            No notifications.
          </AppText>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item: any) => item.id?.toString()}
          renderItem={renderNotification}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
